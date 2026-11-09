import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, MenuItem, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { apiSlice, useGetSocialAccountsQuery } from "../store/apiSlice";
import DestinationPicker from "../components/DestinationPicker";
import WorkspaceNotice from "../components/WorkspaceNotice";
import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import PublishingPaywall from "../components/PublishingPaywall";
import { hasPublishingAccess, platformNames } from "../config/publishing";
import api from "../utils/axiosConfig";

const carouselPlatforms = ["instagram", "tiktok", "facebook"];

export default function CarouselPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const linkedCarousel = searchParams.get("carouselId") || "";
  const linkedPublication = searchParams.get("publication") || "";
  const linkedSavedCarousel = /^[A-Za-z0-9_-]{8,100}$/.test(linkedCarousel);
  const linkedResult = linkedSavedCarousel && /^[A-Za-z0-9_-]{8,100}$/.test(linkedPublication);
  const { user, subscription } = useSelector((s: RootState) => s.auth);
  const userId = user?.userId || "";
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const destinations = (accounts.data?.accounts || []).filter((a) => carouselPlatforms.includes(a.platform));
  const [files, setFiles] = useState<File[]>([]),
    [previews, setPreviews] = useState<string[]>([]),
    [title, setTitle] = useState(""),
    [caption, setCaption] = useState(""),
    [carouselId, setCarouselId] = useState(linkedResult ? linkedCarousel : ""),
    [saved, setSaved] = useState<any[]>([]),
    [target, setTarget] = useState<string[]>([]),
    [mode, setMode] = useState(linkedResult ? "now" : "schedule"),
    [time, setTime] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [paywall, setPaywall] = useState(false),
    [requestId, setRequestId] = useState(() => linkedResult ? linkedPublication : crypto.randomUUID()),
    [submitted, setSubmitted] = useState(linkedResult);
  const [savedLoadError, setSavedLoadError] = useState(false);
  const [statusCheck, setStatusCheck] = useState(0);
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);
  const loadSaved = useCallback(async () => {
    setSavedLoadError(false);
    try {
      const carousels = (await api.get('/api/gruvi/carousels')).data.carousels || [];
      setSaved(carousels);
      if (linkedSavedCarousel) {
        const selected = carousels.find((item: any) => (item.carouselId || item.slideshowId) === linkedCarousel);
        if (selected) { setCarouselId(linkedCarousel); setTitle(selected.title || ""); setCaption(selected.description || ""); }
      }
    }
    catch { setSavedLoadError(true); }
  }, [linkedSavedCarousel, linkedCarousel]);
  useEffect(() => { loadSaved(); }, [loadSaved]);
  const prepare = async () => {
    setBusy(true);
    setError("");
    try {
      if (files.length < 2 || files.length > 10 || !title.trim())
        throw Error("Choose 2 to 10 images and enter a title.");
      const imageKeys = [];
      for (const file of files) {
        if (
          file.size > 5 * 1024 * 1024 ||
          !["image/jpeg", "image/png", "image/webp"].includes(file.type)
        )
          throw Error("Use JPEG, PNG or WebP images up to 5 MB.");
        const { data } = await api.post("/api/gruvi/carousels/get-upload-url", {
          fileType: file.type,
          fileSize: file.size,
        });
        const put = await fetch(data.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!put.ok) throw Error("An image upload failed.");
        imageKeys.push(data.imageKey);
      }
      const { data } = await api.post("/api/gruvi/carousels", {
        title,
        caption,
        imageKeys,
      });
      setCarouselId(data.carouselId);
      setSaved((current) => [data.carousel, ...current]);
      setMessage("Carousel saved. Choose a destination and publishing time.");
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (!userId || !submitted || busy || mode !== "now" || !carouselId) return;

    const controller = new AbortController();
    const deadline = Date.now() + 16 * 60_000;
    let timer: number | undefined;
    const retryStatus = (seconds: number) => {
      if (Date.now() < deadline) timer = window.setTimeout(checkPublication, seconds * 1000);
    };

    const checkPublication = async () => {
      try {
        const { data, headers } = await api.get(
          `/api/gruvi/carousels/${encodeURIComponent(carouselId)}/publications/${encodeURIComponent(requestId)}`,
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;
        setError("");
        switch (data.status) {
          case "published":
            setMessage("Published.");
            break;
          case "failed":
            setMessage("");
            setError(data.error || "Publication failed. Review the error before a new attempt.");
            break;
          case "draft":
            setMessage("Ready in TikTok drafts. Open TikTok to review and finish publishing.");
            break;
          case "pending_reconciliation":
            setMessage(data.warning || "Publication could not be confirmed. Check your social account.");
            break;
          case "processing":
            setMessage(data.warning || "Publishing your carousel. This page updates automatically.");
            retryStatus(Math.max(5, Number(headers["retry-after"]) || 10));
            break;
        }
      } catch (e: any) {
        if (controller.signal.aborted) return;
        setError(e.response?.data?.error || "Status could not be checked.");
        if (!e.response || e.response.status === 429 || e.response.status >= 500) {
          retryStatus(Math.max(10, Number(e.response?.headers?.["retry-after"]) || 10));
        }
      }
    };

    void checkPublication();
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [userId, submitted, busy, mode, carouselId, requestId, statusCheck]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPublishingAccess(subscription)) {
      setPaywall(true);
      return;
    }
    const account = destinations.find(
      (a) => a.accountId === target[0],
    );
    if (!carouselId || !account) {
      setError("Save your carousel and choose one destination.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "schedule") {
        if (!time || new Date(time).getTime() <= Date.now() + 60000)
          throw Error("Choose a time at least one minute in the future.");
        await api.post(`/api/gruvi/carousels/${carouselId}/schedule`, {
          requestId,
          title,
          caption,
          platforms: [
            { platform: account.platform, accountId: account.accountId },
          ],
          scheduledTime: new Date(time).toISOString(),
          ...(account.platform === "facebook" ? {} : { tiktokSettings: { postMode: "draft" } }),
        });
        setSubmitted(true);
        dispatch(apiSlice.util.invalidateTags(["ScheduledPosts"]));
        setMessage("Carousel scheduled. Review it in your calendar.");
      } else {
        setSubmitted(true);
        const { data } = await api.post(
          `/api/gruvi/carousels/${carouselId}/publish`,
          {
            requestId,
            caption,
            platform: account.platform,
            accountId: account.accountId,
            ...(account.platform === "facebook" ? {} : { tiktokSettings: { postMode: "draft" } }),
          },
        );
        setMessage(
          data.status === "published"
            ? `Published on ${platformNames[account.platform]}.`
            : data.status === "draft"
              ? "Ready in TikTok drafts. Open TikTok to review and finish publishing."
              : data.status === "failed"
                ? data.error || "Publication failed. Check the status for details."
                : data.warning || "Publishing your carousel. This page updates automatically.",
        );
      }
    } catch (e: any) {
      if (e.response?.data?.code === "CAROUSEL_QUEUE_UNAVAILABLE") setSubmitted(false);
      setError(
        e.response?.data?.error ||
          e.message ||
          "Publication could not be confirmed. Check its status before repeating it.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Swipe through your story</p>
          <h1>Carousel posts</h1>
          <p>
            Share a sequence of images on Instagram, TikTok or a Facebook Page.
          </p>
          <Link
            className="gd-text-link gd-related-link"
            to="/settings/scheduled-content"
          >
            Open calendar ↗
          </Link>
        </div>
      </header>
      {error && <Alert severity="error">{error}</Alert>}
      {savedLoadError && <WorkspaceNotice onRetry={loadSaved}>Saved carousels could not be loaded.</WorkspaceNotice>}
      {message && <Alert severity="info">{message}</Alert>}
      <form className="gd-form gd-carousel-form" onSubmit={submit}>
        <section className="gd-form-section">
          <h2>1. Prepare your images</h2>
          <TextField
            label="Carousel title"
            value={title}
            disabled={busy || submitted}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Caption"
            value={caption}
            multiline
            minRows={3}
            disabled={busy || submitted}
            onChange={(e) => setCaption(e.target.value)}
          />
          {!carouselId && (
            <>
              <label className="gd-file-picker">
                Choose images
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  disabled={busy}
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
              </label>
              <p className="gd-quiet">
                2 to 10 images, up to 5 MB each. Images are fitted to a 4:5
                canvas without cropping.
              </p>
              {!!files.length && (
                <div className="gd-carousel-images">
                  {files.map((file, i) => (
                    <div key={file.name + i}>
                      <img src={previews[i]} alt={`Slide ${i + 1}`} />
                      <span>
                        {i + 1}. {file.name}
                      </span>
                      <Button
                        size="small"
                        disabled={busy || i === 0}
                        onClick={() =>
                          setFiles((current) => {
                            const next = [...current];
                            [next[i - 1], next[i]] = [next[i], next[i - 1]];
                            return next;
                          })
                        }
                      >
                        Move earlier
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="gd-local-form-actions">
                <Button
                  variant="contained"
                  disabled={
                    busy ||
                    files.length < 2 ||
                    files.length > 10 ||
                    !title.trim()
                  }
                  onClick={prepare}
                >
                  {busy ? "Preparing..." : "Save carousel"}
                </Button>
              </div>
            </>
          )}
          {carouselId && <p className="gd-quiet">Saved and ready: {title}</p>}
          {!carouselId && !!saved.length && (
            <div className="gd-carousel-saved">
              <h3>Or use a saved carousel</h3>
              {saved.map((c) => (
                <Button
                  key={c.carouselId || c.slideshowId}
                  variant="outlined"
                  onClick={() => {
                    setCarouselId(c.carouselId || c.slideshowId);
                    setTitle(c.title);
                    setCaption(c.description || "");
                  }}
                >
                  {c.title}
                </Button>
              ))}
            </div>
          )}
        </section>
        <section className="gd-form-section">
          <h2>2. Destination</h2>
          <p>Choose one account for this post.</p>
          {accounts.isError ? (
            <WorkspaceNotice onRetry={() => accounts.refetch()}>
              Your connected accounts could not be loaded.
            </WorkspaceNotice>
          ) : accounts.isLoading ? (
            <WorkspaceSkeleton
              label="Loading destinations"
              kind="list"
              rows={2}
            />
          ) : destinations.length ? (
            <DestinationPicker
              accounts={destinations}
              selectedIds={target}
              disabled={busy || submitted}
              onToggle={(id, checked) => setTarget(checked ? [id] : [])}
            />
          ) : (
            <div className="gd-destination-empty">
              <p>Connect Instagram, TikTok or a Facebook Page to publish a carousel.</p>
              <Link className="gd-text-link" to="/settings/connected-accounts">
                Connect an account →
              </Link>
            </div>
          )}
          <p className="gd-quiet">
            TikTok photo posts go to the creator inbox so you can review and
            publish them. Instagram requires a professional account. Facebook publishes all images in one Page post.
          </p>
        </section>
        <section className="gd-form-section">
          <h2>3. Publishing time</h2>
          <TextField
            select
            label="When"
            value={mode}
            disabled={busy || submitted}
            onChange={(e) => setMode(e.target.value)}
          >
            <MenuItem value="schedule">Schedule for later</MenuItem>
            <MenuItem value="now">Publish now</MenuItem>
          </TextField>
          {mode === "schedule" && (
            <TextField
              label="Date and time (your timezone)"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={time}
              disabled={busy || submitted}
              onChange={(e) => setTime(e.target.value)}
            />
          )}
        </section>
        <footer className="gd-form-actions">
          {submitted && mode === "now" && (
            <Button variant="outlined" onClick={() => setStatusCheck((value) => value + 1)}>
              Check publication status
            </Button>
          )}
          {submitted ? (
            <>
              <Button
                component={Link}
                to="/settings/scheduled-content"
                variant="outlined"
              >
                View calendar
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setCarouselId("");
                  setFiles([]);
                  setSubmitted(false);
                  setMessage("");
                  setRequestId(crypto.randomUUID());
                }}
              >
                New carousel
              </Button>
            </>
          ) : (
            <Button
              type="submit"
              variant="contained"
              className="gd-primary-action"
              disabled={busy || !carouselId || !target.length}
            >
              {busy
                ? "Submitting..."
                : mode === "schedule"
                  ? "Schedule carousel"
                  : "Publish carousel"}
            </Button>
          )}
        </footer>
      </form>
      <PublishingPaywall open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
}
