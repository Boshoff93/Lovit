import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import React, { useEffect, useRef, useState } from "react";
import { Pagination, TextField } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import WorkspaceNotice from "../components/WorkspaceNotice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useGetUserVideosQuery, Video } from "../store/apiSlice";
import "./MediaLibraryPage.css";

function MediaLibraryVideoCard({
  video,
  active,
  onPlay,
}: {
  video: Video;
  active: boolean;
  onPlay: () => void;
}) {
  const player = useRef<HTMLVideoElement>(null);
  const [measuredRatio, setMeasuredRatio] = useState<number>();
  const [posterRatio, setPosterRatio] = useState<number>();
  const [playbackError, setPlaybackError] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const title = video.title || video.songTitle || "Untitled video";
  const poster = video.socialThumbnailUrl || video.thumbnailUrl;
  const declaredRatio =
    video.aspectRatio === "portrait"
      ? 9 / 16
      : video.aspectRatio === "landscape"
        ? 16 / 9
        : undefined;
  const ratio = measuredRatio || declaredRatio || posterRatio || 16 / 9;

  useEffect(() => {
    setPosterFailed(false);
    setPosterRatio(undefined);
  }, [poster]);

  useEffect(() => {
    setMeasuredRatio(undefined);
    setPlaybackError(false);
  }, [video.videoUrl]);

  useEffect(() => {
    if (!active) player.current?.pause();
  }, [active]);

  useEffect(() => {
    const element = player.current;
    return () => element?.pause();
  }, [video.videoUrl]);

  const startPlayback = () => {
    const element = player.current;
    if (!element) return;
    onPlay();
    if (playbackError) element.load();
    setPlaybackError(false);
    // Call play in the click handler so browsers retain the user's play gesture.
    const playback = element.play();
    playback?.catch((error: DOMException) => {
      // Switching to another video can interrupt an in-flight play request.
      if (error.name !== "AbortError") setPlaybackError(true);
    });
  };

  return (
    <article className="gd-media-card">
      <div
        className="gd-library-preview"
        data-orientation={ratio < 1 ? "portrait" : ratio > 1 ? "landscape" : "square"}
        style={{ aspectRatio: ratio }}
      >
        {video.videoUrl && (
          <video
            ref={player}
            className="gd-library-video"
            src={video.videoUrl}
            poster={active && !posterFailed ? poster : undefined}
            controls={active}
            hidden={!active}
            playsInline
            preload="none"
            aria-label={`Video preview: ${title}`}
            onLoadedMetadata={(event) => {
              const element = event.currentTarget;
              if (element.videoWidth && element.videoHeight)
                setMeasuredRatio(element.videoWidth / element.videoHeight);
            }}
            onPlay={() => {
              onPlay();
              setPlaybackError(false);
            }}
            onError={() => setPlaybackError(true)}
          />
        )}
        {!active && (
          <>
            {poster && !posterFailed ? (
              <img
                className="gd-library-poster"
                src={poster}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (image.naturalWidth && image.naturalHeight)
                    setPosterRatio(image.naturalWidth / image.naturalHeight);
                }}
                onError={() => setPosterFailed(true)}
              />
            ) : (
              <div className="gd-library-placeholder">
                <VideocamOutlinedIcon aria-hidden="true" />
                {!video.videoUrl && <span>Preview unavailable</span>}
              </div>
            )}
            {video.videoUrl && (
              <button
                type="button"
                className="gd-library-play"
                aria-label={`Play ${title}`}
                onClick={startPlayback}
              >
                <span><PlayArrowRoundedIcon aria-hidden="true" /></span>
              </button>
            )}
          </>
        )}
      </div>
      <div className="gd-library-card-body">
        <h2>{title}</h2>
        <p>{video.status === "completed" ? "Ready to publish" : video.status}</p>
        {active && playbackError && (
          <p className="gd-library-playback-error" role="alert">
            This video could not play.{" "}
            <button type="button" onClick={startPlayback}>Try again</button>
          </p>
        )}
        <Link className="gd-text-link" to={`/posts/new?videoId=${video.videoId}`}>
          Prepare post ↗
        </Link>
      </div>
    </article>
  );
}

export default function MediaLibraryPage() {
  const userId =
    useSelector((state: RootState) => state.auth.user?.userId) || "";
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const query = useGetUserVideosQuery(
    { userId, page, limit: 12 },
    { skip: !userId },
  );
  const videos = (query.data?.videos || []).filter((v) =>
    (v.title || v.songTitle || "").toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="gd gd-media-library">
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
            <MediaLibraryVideoCard
              key={video.videoId}
              video={video}
              active={activeVideoId === video.videoId}
              onPlay={() => setActiveVideoId(video.videoId)}
            />
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
          onChange={(_, value) => {
            setActiveVideoId(null);
            setPage(value);
          }}
          sx={{ mt: 4 }}
        />
      )}
    </div>
  );
}
