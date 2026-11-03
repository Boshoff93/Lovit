import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, MenuItem, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import { useGetSocialAccountsQuery } from "../store/apiSlice";
import DestinationPicker from "../components/DestinationPicker";
import WorkspaceNotice from "../components/WorkspaceNotice";
import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import PublishingPaywall from "../components/PublishingPaywall";
import { hasPublishingAccess } from "../config/publishing";
import api from "../utils/axiosConfig";
export default function CarouselPage() {
  const { user, subscription } = useSelector((s: RootState) => s.auth);
  const userId = user?.userId || "";
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const [files, setFiles] = useState<File[]>([]),
    [previews, setPreviews] = useState<string[]>([]),
    [title, setTitle] = useState(""),
    [caption, setCaption] = useState(""),
    [carouselId, setCarouselId] = useState(""),
    [saved, setSaved] = useState<any[]>([]),
    [target, setTarget] = useState<string[]>([]),
    [mode, setMode] = useState("schedule"),
    [time, setTime] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [paywall, setPaywall] = useState(false),
    [requestId, setRequestId] = useState(() => crypto.randomUUID()),
    [submitted, setSubmitted] = useState(false);
  const [savedLoadError, setSavedLoadError] = useState(false);
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);
  const loadSaved = useCallback(async () => {
    setSavedLoadError(false);
    try { setSaved((await api.get('/api/gruvi/carousels')).data.carousels || []); }
    catch { setSavedLoadError(true); }
  }, []);
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
  const status = async () => {
    try {
      const { data } = await api.get(
        `/api/gruvi/carousels/${carouselId}/publications/${requestId}`,
      );
      setMessage(
        data.status === "published"
          ? "Published on Instagram."
          : data.status === "failed"
            ? "Publication failed. Review the error before a new attempt."
            : "TikTok or Gruvi is still processing this publication. Review your TikTok inbox for draft posts.",
      );
    } catch (e: any) {
      setError(e.response?.data?.error || "Status could not be checked.");
    }
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPublishingAccess(subscription)) {
      setPaywall(true);
      return;
    }
    const account = (accounts.data?.accounts || []).find(
      (a) => a.accountId === target[0],
    );
    if (!carouselId || !account) {
      setError("Save your carousel and choose one destination.");
      return;
    }
    setBusy(true);
    setError("");
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
          tiktokSettings: { postMode: "draft" },
        });
        setSubmitted(true);
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
            tiktokSettings: { postMode: "draft" },
          },
        );
        setMessage(
          data.status === "published"
            ? "Published on Instagram."
            : "Accepted for TikTok processing. Open TikTok to review and finish draft posts.",
        );
      }
    } catch (e: any) {
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
            Upload a sequence of images for Instagram or TikTok. No generation
            required.
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
          ) : accounts.data?.accounts.some((a) =>
              ["instagram", "tiktok"].includes(a.platform),
            ) ? (
            <DestinationPicker
              accounts={(accounts.data?.accounts || []).filter((a) =>
                ["instagram", "tiktok"].includes(a.platform),
              )}
              selectedIds={target}
              disabled={busy || submitted}
              onToggle={(id, checked) => setTarget(checked ? [id] : [])}
            />
          ) : (
            <div className="gd-destination-empty">
              <p>Connect Instagram or TikTok to publish a carousel.</p>
              <Link className="gd-text-link" to="/settings/connected-accounts">
                Connect an account →
              </Link>
            </div>
          )}
          <p className="gd-quiet">
            TikTok photo posts go to the creator inbox so you can review and
            publish them. Instagram requires an eligible professional account.
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
            <Button variant="outlined" onClick={status}>
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
