import React, { useState } from "react";
import { Alert, Button, Checkbox, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  useGetSocialAccountsQuery,
  useGetUserVideosQuery,
} from "../store/apiSlice";
import DestinationPicker from "../components/DestinationPicker";
import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import WorkspaceNotice from "../components/WorkspaceNotice";
import PublishingPaywall from "../components/PublishingPaywall";
import { hasPublishingAccess } from "../config/publishing";
import { uploadDistributionVideo } from "../utils/distributionMedia";
import api from "../utils/axiosConfig";
const localTime = (time: number) => {
  const date = new Date(time);
  return new Date(time - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
export default function BulkSchedulePage() {
  const { user, subscription } = useSelector((s: RootState) => s.auth);
  const userId = user?.userId || "";
  const library = useGetUserVideosQuery(
    { userId, page: 1, limit: 100 },
    { skip: !userId },
  );
  const accounts = useGetSocialAccountsQuery({ userId }, { skip: !userId });
  const [rows, setRows] = useState<
    Record<string, { title: string; description: string; time: string }>
  >({});
  const [targets, setTargets] = useState<string[]>([]);
  const [start, setStart] = useState("");
  const [hours, setHours] = useState(24);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [paywall, setPaywall] = useState(false);
  const videos =
    library.data?.videos.filter((v) => v.status === "completed") || [];
  const fill = () => {
    if (!start || !Number.isFinite(hours) || hours < 1) return;
    setRows(
      Object.fromEntries(
        Object.entries(rows).map(([id, row], i) => [
          id,
          {
            ...row,
            time: localTime(new Date(start).getTime() + i * hours * 3600000),
          },
        ]),
      ),
    );
  };
  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    if (files.length > 20) {
      setError("Upload up to 20 videos at a time.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        await uploadDistributionVideo(
          userId,
          file,
          title,
          "",
          "portrait",
          () => {},
        );
      }
      await library.refetch();
    } catch (e: any) {
      setError(
        e.message ||
          "An upload failed. Refresh the media library before repeating it.",
      );
    } finally {
      setUploading(false);
    }
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!hasPublishingAccess(subscription)) {
      setPaywall(true);
      return;
    }
    if (!Object.keys(rows).length || !targets.length) {
      setError("Choose videos and at least one account.");
      return;
    }
    const selected = (accounts.data?.accounts || []).filter((a) =>
      targets.includes(a.accountId),
    );
    setBusy(true);
    try {
      const posts = Object.entries(rows).map(([videoId, row]) => {
        if (!row.time || new Date(row.time).getTime() <= Date.now() + 60000)
          throw Error("Choose a future time for every video.");
        return {
          videoId,
          title: row.title,
          description: row.description,
          scheduledTime: new Date(row.time).toISOString(),
          platforms: selected.map((a) => ({
            platform: a.platform,
            accountId: a.accountId,
          })),
          addThumbnailIntro: false,
          tiktokSettings: { postMode: "draft", privacyLevel: "SELF_ONLY" },
        };
      });
      const response = await api.post("/api/gruvi/scheduled-posts/bulk", {
        requestId,
        posts,
      });
      setResults(response.data.results);
    } catch (e: any) {
      setError(
        e.response?.data?.error ||
          e.message ||
          "Acceptance is uncertain. Check your calendar or retry this unchanged batch.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Plan several posts</p>
          <h1>Bulk video scheduling</h1>
          <p>
            Choose up to 20 videos, set their times and schedule them in one
            batch.
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
      <form onSubmit={submit} className="gd-form gd-bulk-form">
        <section className="gd-form-section">
          <h2>1. Choose your videos</h2>
          <p>
            Upload finished videos or select them from your library. Uploads
            remain available before subscribing.
          </p>
          <label className="gd-file-picker">
            Upload videos
            <input
              type="file"
              multiple
              accept="video/mp4,video/quicktime,video/webm"
              disabled={busy || uploading || !!results}
              onChange={(e) => upload(e.target.files)}
            />
          </label>
          {uploading && (
            <p role="status">Uploading videos to your media library...</p>
          )}
          {library.isError ? (
            <WorkspaceNotice onRetry={() => library.refetch()}>
              Your videos could not be loaded.
            </WorkspaceNotice>
          ) : library.isLoading ? (
            <WorkspaceSkeleton label="Loading videos" rows={3} />
          ) : videos.length ? (
            <div className="gd-bulk-videos">
              {videos.map((v) => (
                <label key={v.videoId} className="gd-bulk-video">
                  <Checkbox
                    disabled={
                      busy ||
                      !!results ||
                      (!rows[v.videoId] && Object.keys(rows).length >= 20)
                    }
                    checked={!!rows[v.videoId]}
                    onChange={(e) =>
                      setRows((current) => {
                        const next = { ...current };
                        if (e.target.checked)
                          next[v.videoId] = {
                            title: v.title || v.songTitle || "Untitled video",
                            description: "",
                            time: "",
                          };
                        else delete next[v.videoId];
                        return next;
                      })
                    }
                  />
                  <span>{v.title || v.songTitle || v.videoId}</span>
                </label>
              ))}
            </div>
          ) : null}
          {!library.isError && !library.isLoading && !videos.length && (
            <p>No finished videos yet. Upload your first batch above.</p>
          )}
        </section>
        <section className="gd-form-section">
          <h2>2. Destinations</h2>
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
          ) : accounts.data?.accounts.length ? (
            <DestinationPicker
              accounts={accounts.data?.accounts || []}
              selectedIds={targets}
              disabled={busy || !!results}
              onToggle={(id, checked) =>
                setTargets((current) =>
                  checked ? [...current, id] : current.filter((x) => x !== id),
                )
              }
            />
          ) : (
            <div className="gd-destination-empty">
              <p>Connect an account to choose where this batch goes.</p>
              <Link className="gd-text-link" to="/settings/connected-accounts">
                Connect an account →
              </Link>
            </div>
          )}
          <p className="gd-quiet">
            TikTok videos are sent to the creator inbox for review. Other
            networks publish at the scheduled time.
          </p>
        </section>
        <section className="gd-form-section">
          <h2>3. Set times and captions</h2>
          <p>
            Set the first publishing time, then space the rest of your selected
            videos evenly.
          </p>
          <div className="gd-inline-fields">
            <TextField
              label="Start publishing"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={start}
              onChange={(e) => setStart(e.target.value)}
              disabled={busy || !!results}
            />
            <TextField
              label="Post every (hours)"
              type="number"
              inputProps={{ min: 1, max: 8760 }}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              disabled={busy || !!results}
            />
            <Button
              variant="outlined"
              onClick={fill}
              disabled={
                busy ||
                !!results ||
                !start ||
                !Object.keys(rows).length ||
                !Number.isFinite(hours) ||
                hours < 1 ||
                hours > 8760
              }
            >
              Apply times
            </Button>
          </div>
          <p className="gd-field-note">
            24 hours means one post a day. All times use your local timezone,
            and you can adjust each post below.
          </p>
          {Object.entries(rows).map(([id, row], index) => (
            <div className="gd-bulk-row" key={id}>
              <strong>Post {index + 1}</strong>
              <TextField
                label="Title"
                value={row.title}
                disabled={busy || !!results}
                onChange={(e) =>
                  setRows((current) => ({
                    ...current,
                    [id]: { ...current[id], title: e.target.value },
                  }))
                }
              />
              <TextField
                label="Caption"
                multiline
                minRows={2}
                value={row.description}
                disabled={busy || !!results}
                onChange={(e) =>
                  setRows((current) => ({
                    ...current,
                    [id]: { ...current[id], description: e.target.value },
                  }))
                }
              />
              <TextField
                label="Publish time (your timezone)"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                value={row.time}
                disabled={busy || !!results}
                onChange={(e) =>
                  setRows((current) => ({
                    ...current,
                    [id]: { ...current[id], time: e.target.value },
                  }))
                }
              />
            </div>
          ))}
        </section>
        {results && (
          <section className="gd-form-section">
            <h2>Batch results</h2>
            {results.map((r) => (
              <p key={r.index}>
                Post {r.index + 1}: {r.success ? "Scheduled" : r.error}
              </p>
            ))}
            <Link to="/settings/scheduled-content">Review in calendar ↗</Link>
          </section>
        )}
        <footer className="gd-form-actions">
          <Button
            variant="outlined"
            component={Link}
            to="/settings/scheduled-content"
          >
            View calendar
          </Button>
          {results ? (
            <Button
              variant="contained"
              onClick={() => {
                setRows({});
                setResults(null);
                setRequestId(crypto.randomUUID());
              }}
            >
              New batch
            </Button>
          ) : (
            <Button
              className="gd-primary-action"
              variant="contained"
              type="submit"
              disabled={busy || uploading || !Object.keys(rows).length}
            >
              {busy
                ? "Scheduling..."
                : `Schedule ${Object.keys(rows).length || ""} videos`}
            </Button>
          )}
        </footer>
      </form>
      <PublishingPaywall open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
}
