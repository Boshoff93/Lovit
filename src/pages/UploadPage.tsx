import React, { useState } from "react";
import {
  Alert,
  Button,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  uploadDistributionVideo,
  thumbnailDataUrl,
} from "../utils/distributionMedia";
import { videosApi } from "../services/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { apiSlice } from "../store/apiSlice";
export default function UploadPage() {
  const userId =
    useSelector((state: RootState) => state.auth.user?.userId) || "";
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ratio, setRatio] = useState("portrait");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedId, setUploadedId] = useState("");
  const [uncertain, setUncertain] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !uploadedId) return;
    setBusy(true);
    setError("");
    let id = uploadedId;
    try {
      if (!id && file) {
        id = await uploadDistributionVideo(
          userId,
          file,
          title,
          description,
          ratio,
          setProgress,
        );
        setUploadedId(id);
        dispatch(apiSlice.util.invalidateTags(["Videos"]));
      }
      if (thumbnail)
        await videosApi.uploadThumbnail(userId, id, {
          thumbnailBase64: thumbnail,
        });
      navigate("/posts/new?videoId=" + id);
    } catch (err: any) {
      if (err.videoId) setUncertain(true);
      setError(
        id
          ? "Your video is saved. The thumbnail could not be saved; retry this step or continue from the media library."
          : err.response?.data?.error || err.message || "Upload failed.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Bring your own content</p>
          <h1>Upload a video</h1>
          <p>Add finished content to your library, then prepare a post.</p>
          <Link className="gd-text-link gd-related-link" to="/media">
            Media library ↗
          </Link>
        </div>
      </header>
      <form className="gd-post-form" onSubmit={submit}>
        <div className="gd-form gd-upload-form">
          {error && <Alert severity="error">{error}</Alert>}
          <label className="gd-file-input">
            Video file
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
              disabled={busy || !!uploadedId}
              required={!uploadedId}
              onChange={(e) => {
                const selected = e.target.files?.[0] || null;
                setFile(selected);
                if (selected && !title)
                  setTitle(selected.name.replace(/\.[^.]+$/, ""));
              }}
            />
            <small>MP4, MOV or WebM, up to 512 MB.</small>
          </label>
          <TextField
            label="Title"
            required
            value={title}
            disabled={busy || !!uploadedId}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            value={description}
            disabled={busy || !!uploadedId}
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            select
            label="Video format"
            value={ratio}
            disabled={busy || !!uploadedId}
            onChange={(e) => setRatio(e.target.value)}
          >
            <MenuItem value="portrait">Portrait</MenuItem>
            <MenuItem value="landscape">Landscape</MenuItem>
          </TextField>
          <label className="gd-file-input">
            Custom thumbnail (optional)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy}
              onChange={async (e) => {
                const selected = e.target.files?.[0];
                if (!selected) return;
                try {
                  setThumbnail(await thumbnailDataUrl(selected));
                  setError("");
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Unable to read thumbnail.",
                  );
                }
              }}
            />
            <small>JPEG, PNG or WebP, up to 5 MB.</small>
          </label>
          {thumbnail && (
            <img
              className="gd-thumbnail-preview"
              src={thumbnail}
              alt="Selected custom thumbnail"
            />
          )}
          {busy && (
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label="Video upload progress"
            />
          )}
        </div>
        <footer className="gd-page-actions">
          <Button
            className="gd-primary-action"
            type="submit"
            variant="contained"
            disabled={busy || uncertain || (!file && !uploadedId)}
          >
            {busy
              ? `Uploading ${progress}%`
              : uploadedId
                ? "Retry thumbnail & continue"
                : "Upload & prepare post"}
          </Button>
        </footer>
      </form>
    </div>
  );
}
