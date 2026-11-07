import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PublishingPaywall from "../components/PublishingPaywall";
import DestinationPicker from "../components/DestinationPicker";
import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import WorkspaceNotice from "../components/WorkspaceNotice";
import { AppDispatch, RootState } from "../store/store";
import {
  apiSlice,
  useGetSocialAccountsQuery,
  useGetUserVideosQuery,
} from "../store/apiSlice";
import { videosApi, scheduledPostsApi } from "../services/api";
import { hasPublishingAccess } from "../config/publishing";
import {
  thumbnailDataUrl,
  uploadDistributionVideo,
} from "../utils/distributionMedia";

export default function PostComposerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const subscription = useSelector((s: RootState) => s.auth.subscription);
  const [paywall, setPaywall] = useState(false);
  const userId = useSelector((s: RootState) => s.auth.user?.userId) || "";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const library = useGetUserVideosQuery(
    { userId, page: 1, limit: 100 },
    { skip: !userId },
  );
  const [videoId, setVideoId] = useState(params.get("videoId") || "");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [targets, setTargets] = useState<string[]>([]);
  const [mode, setMode] = useState("schedule");
  const [time, setTime] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [acceptedId, setAcceptedId] = useState("");
  const [uncertain, setUncertain] = useState(false);
  const [tiktokMode, setTiktokMode] = useState<"draft" | "direct">("draft");
  const [privacy, setPrivacy] = useState("SELF_ONLY");
  const [allowComment, setAllowComment] = useState(false);
  const [disclose, setDisclose] = useState(false);
  const [ownBrand, setOwnBrand] = useState(false);
  const [paidBrand, setPaidBrand] = useState(false);
  const selected = (accounts.data?.accounts || []).filter((a) =>
    targets.includes(a.accountId),
  );
  const hasTikTok = selected.some((a) => a.platform === "tiktok");
  useEffect(() => {
    let cancelled = false;
    if (videoId) {
      videosApi
        .getVideo(userId, videoId)
        .then((r) => {
          if (cancelled) return;
          const v = r.data.video || r.data;
          setTitle(v.title || v.songTitle || "");
          setDescription(v.socialMetadata?.description || v.description || "");
        })
        .catch(() => {
          if (!cancelled) setError("The selected media could not be loaded.");
        });
    }
    return () => {
      cancelled = true;
    };
  }, [userId, videoId]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (acceptedId || uncertain) return;
    setError("");
    if (!hasPublishingAccess(subscription)) {
      setPaywall(true);
      return;
    }
    if (!title.trim() || !selected.length || (!videoId && !file)) {
      setError(
        "Choose a video, enter a title and select at least one connected account.",
      );
      return;
    }
    if (
      mode === "schedule" &&
      (!time || new Date(time).getTime() <= Date.now() + 60000)
    ) {
      setError("Choose a time at least one minute in the future.");
      return;
    }
    setBusy(true);
    let id = videoId;
    let submitting = false;
    try {
      if (!id && file) {
        id = await uploadDistributionVideo(
          userId,
          file,
          title,
          description,
          "portrait",
          setProgress,
        );
        setVideoId(id);
      }
      await videosApi.updateSocialMetadata(userId, id, {
        title: title.trim(),
        description,
        tags: tags
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      });
      if (thumbnail)
        await videosApi.uploadThumbnail(userId, id, {
          thumbnailBase64: thumbnail,
        });
      const tiktokSettings = hasTikTok
        ? {
            postMode: tiktokMode,
            privacyLevel: privacy,
            allowComment,
            allowDuet: false,
            allowStitch: false,
            discloseContent: disclose,
            brandOrganic: ownBrand,
            brandedContent: paidBrand,
          }
        : undefined;
      const platforms = selected.map((a) => ({
        platform: a.platform,
        accountId: a.accountId,
        accountName: a.accountName || a.username,
      }));
      submitting = true;
      if (mode === "schedule") {
        const result = await scheduledPostsApi.createScheduledPost({
          videoId: id,
          platforms,
          scheduledTime: new Date(time).toISOString(),
          title: title.trim(),
          description,
          tags: tags
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
          tiktokSettings,
        });
        dispatch(apiSlice.util.invalidateTags(["ScheduledPosts"]));
        setAcceptedId(result.data.scheduleId || "scheduled");
        navigate(result.data.scheduleId ? `/settings/scheduled-content?highlight=${encodeURIComponent(result.data.scheduleId)}` : "/settings/scheduled-content");
      } else {
        await videosApi.batchSocialUpload(userId, id, {
          platforms,
          tiktokSettings,
        });
        setAcceptedId(id);
        navigate("/posts/status/" + id);
      }
    } catch (err: any) {
      if (err.response?.data?.code === "PUBLISHING_PLAN_REQUIRED") {
        setPaywall(true);
      } else if (err.videoId) {
        setVideoId(err.videoId);
        setUncertain(true);
        setError(err.message);
      } else if (submitting && (!err.response || err.response.status >= 500)) {
        setUncertain(true);
        setError(
          "Delivery acceptance could not be confirmed. Check the post status before sending again.",
        );
      } else
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "The post could not be submitted.",
        );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Content distribution</p>
          <h1>Prepare a post</h1>
          <p>Your video, caption and thumbnail. Your choice of channels.</p>
          <Link className="gd-text-link gd-related-link" to="/media">
            Media library ↗
          </Link>
        </div>
      </header>
      <form onSubmit={submit} className="gd-post-form">
        <div className="gd-composer">
          <div className="gd-form">
            {error && (
              <Alert severity="error">
                {error}
                {uncertain && (
                  <>
                    <br />
                    <Link to={"/posts/status/" + videoId}>
                      Check delivery status →
                    </Link>
                  </>
                )}
              </Alert>
            )}
            {library.isError && (
              <Alert severity="warning">
                The media library could not be loaded. You can upload a new video.
              </Alert>
            )}
            <section className="gd-form-section">
              <h2>1. Content</h2>
              <TextField
                select
                label="Choose a video"
                value={videoId}
                onChange={(e) => {
                  setVideoId(e.target.value);
                  setFile(null);
                }}
                disabled={busy}
              >
                <MenuItem value="">Upload a new video</MenuItem>
                {videoId &&
                  !library.data?.videos.some((v) => v.videoId === videoId) && (
                    <MenuItem value={videoId}>Selected video</MenuItem>
                  )}
                {(library.data?.videos || [])
                  .filter((v) => v.status === "completed")
                  .map((v) => (
                    <MenuItem key={v.videoId} value={v.videoId}>
                      {v.title || v.songTitle || v.videoId}
                    </MenuItem>
                  ))}
              </TextField>
              {!videoId && (
                <label className="gd-file-input">
                  Video
                  <input
                    type="file"
                    accept=".mp4,.mov,.webm"
                    disabled={busy}
                    onChange={(e) => {
                      const v = e.target.files?.[0] || null;
                      setFile(v);
                      if (v && !title) setTitle(v.name.replace(/\.[^.]+$/, ""));
                    }}
                  />
                  <small>
                    Up to 512 MB. A portrait video is the default for new uploads.
                  </small>
                </label>
              )}
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={busy}
              />
              <TextField
                label="Caption / description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={4}
                disabled={busy}
              />
              <TextField
                label="Tags, separated by commas"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={busy}
              />
              <label className="gd-file-input">
                Custom thumbnail (optional)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy}
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f)
                      try {
                        setThumbnail(await thumbnailDataUrl(f));
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : "Thumbnail could not be read.",
                        );
                      }
                  }}
                />
              </label>
              {thumbnail && (
                <img
                  className="gd-thumbnail-preview"
                  src={thumbnail}
                  alt="Custom post thumbnail"
                />
              )}
            </section>
            <section className="gd-form-section">
              <div className="gd-destinations-heading">
                <div>
                  <h2>2. Destinations</h2>
                  <p>Choose the accounts for this post.</p>
                </div>
                <span className={`gd-destination-count${selected.length ? ' has-selection' : ''}`}>
                  {selected.length} selected
                </span>
              </div>
              {accounts.isError ? (
                <WorkspaceNotice onRetry={() => accounts.refetch()}>
                  Connected accounts could not be loaded.
                </WorkspaceNotice>
              ) : accounts.isLoading ? (
                <WorkspaceSkeleton label="Loading destinations" kind="list" rows={3} />
              ) : !accounts.data?.accounts.length ? (
                <div className="gd-destination-empty">
                  <p>Connect a social account to choose where your post goes.</p>
                  <Link className="gd-button" to="/settings/connected-accounts">
                    Connect an account
                  </Link>
                </div>
              ) : (
                <>
                  <DestinationPicker
                    accounts={accounts.data?.accounts || []}
                    selectedIds={targets}
                    disabled={busy}
                    onToggle={(accountId, checked) =>
                      setTargets(old => checked
                        ? [...old, accountId]
                        : old.filter(value => value !== accountId))
                    }
                  />
                  <Link className="gd-text-link gd-manage-destinations" to="/settings/connected-accounts">
                    Manage connected accounts ↗
                  </Link>
                </>
              )}
              {hasTikTok && (
                <div className="gd-form">
                  <TextField
                    select
                    label="TikTok delivery"
                    value={tiktokMode}
                    onChange={(e) =>
                      setTiktokMode(e.target.value as "draft" | "direct")
                    }
                  >
                    <MenuItem value="draft">
                      Send to TikTok inbox for review
                    </MenuItem>
                    <MenuItem value="direct">Direct post</MenuItem>
                  </TextField>
                  {tiktokMode === "direct" && (
                    <TextField
                      select
                      label="TikTok privacy"
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value)}
                    >
                      <MenuItem value="SELF_ONLY">Only me</MenuItem>
                      <MenuItem value="PUBLIC_TO_EVERYONE">Public</MenuItem>
                      <MenuItem value="MUTUAL_FOLLOW_FRIENDS">Friends</MenuItem>
                    </TextField>
                  )}
                  <p className="gd-quiet">
                    Available privacy and interaction settings depend on the
                    connected TikTok account and app permissions.
                  </p>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allowComment}
                        onChange={(_, v) => setAllowComment(v)}
                      />
                    }
                    label="Allow TikTok comments"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={disclose}
                        onChange={(_, v) => setDisclose(v)}
                      />
                    }
                    label="Disclose AI-generated content"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ownBrand}
                        onChange={(_, v) => setOwnBrand(v)}
                      />
                    }
                    label="This promotes my own brand"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={paidBrand}
                        onChange={(_, v) => setPaidBrand(v)}
                      />
                    }
                    label="This is paid branded content"
                  />
                </div>
              )}
            </section>
          </div>
          <aside className="gd-form gd-post-review">
            <p className="gd-eyebrow">Publishing details</p>
            <h2>{title || "Your next post"}</h2>
            <p>
              {selected.length} connected{" "}
              {selected.length === 1 ? "account" : "accounts"} selected
            </p>
            <TextField
              select
              label="When"
              value={mode}
              disabled={busy}
              onChange={(e) => setMode(e.target.value)}
            >
              <MenuItem value="schedule">Schedule for later</MenuItem>
              <MenuItem value="now">Publish now</MenuItem>
            </TextField>
            {mode === "schedule" && (
              <TextField
                label="Date & time (your timezone)"
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                disabled={busy}
              />
            )}
            <p className="gd-quiet">
              Submitting sends the content to the selected accounts. Delivery is
              checked separately for each destination.
            </p>
            {busy && progress > 0 && (
              <LinearProgress
                value={progress}
                variant="determinate"
                aria-label="Upload progress"
              />
            )}
            <Link className="gd-text-link" to="/docs/social">
              Platform settings & limits ↗
            </Link>
          </aside>
        </div>
        <footer className="gd-page-actions">
          <Button
            className="gd-primary-action"
            type="submit"
            variant="contained"
            disabled={busy || uncertain || !!acceptedId}
          >
            {busy
              ? "Preparing your post..."
              : mode === "schedule"
                ? "Schedule post"
                : "Publish to selected accounts"}
          </Button>
        </footer>
      </form>
      <PublishingPaywall open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
}
