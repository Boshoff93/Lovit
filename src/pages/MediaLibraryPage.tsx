import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import React, { useState } from "react";
import { Pagination, TextField } from "@mui/material";
import WorkspaceNotice from "../components/WorkspaceNotice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGetUserVideosQuery } from "../store/apiSlice";
export default function MediaLibraryPage() {
  const userId =
    useSelector((state: RootState) => state.auth.user?.userId) || "";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const query = useGetUserVideosQuery(
    { userId, page, limit: 12 },
    { skip: !userId },
  );
  const videos = (query.data?.videos || []).filter((v) =>
    (v.title || v.songTitle || "").toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Your content</p>
          <h1>Media library</h1>
          <p>Finished videos, ready to post again when you need them.</p>
          <div className="gd-card-actions">
            <Link
              className="gd-button gd-primary-action gd-card-action"
              to="/upload"
            >
              Upload a video +
            </Link>
          </div>
        </div>
      </header>
      <TextField
        label="Filter this page"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3, width: { xs: "100%", sm: 320 } }}
      />
      {query.isError ? (
        <WorkspaceNotice onRetry={() => query.refetch()}>
          Your media could not be loaded.
        </WorkspaceNotice>
      ) : query.isLoading ? (
        <WorkspaceSkeleton label="Loading media" rows={6} />
      ) : videos.length ? (
        <div className="gd-media-grid">
          {videos.map((video) => (
            <article key={video.videoId} className="gd-media-card">
              {video.thumbnailUrl || video.socialThumbnailUrl ? (
                <img
                  src={video.socialThumbnailUrl || video.thumbnailUrl}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className="gd-media-placeholder">Video</div>
              )}
              <div>
                <h2>{video.title || video.songTitle || "Untitled video"}</h2>
                <p>
                  {video.status === "completed"
                    ? "Ready to publish"
                    : video.status}
                </p>
                <Link
                  className="gd-text-link"
                  to={`/posts/new?videoId=${video.videoId}`}
                >
                  Prepare post ↗
                </Link>
                {video.videoUrl && (
                  <a
                    className="gd-text-link"
                    href={video.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open video ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="gd-empty">
          <h2>
            {search
              ? "No videos match this filter."
              : "Your content starts here."}
          </h2>
          <p>Upload a finished video to add it to your media library.</p>
          <Link
            className="gd-button gd-primary-action gd-card-action"
            to="/upload"
          >
            Upload a video +
          </Link>
        </div>
      )}
      {(query.data?.totalCount || 0) > 12 && (
        <Pagination
          count={Math.ceil((query.data?.totalCount || 0) / 12)}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mt: 4 }}
        />
      )}
    </div>
  );
}
