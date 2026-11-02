import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import React, { useEffect, useState } from "react";
import { Alert, Button, Chip } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { videosApi } from "../services/api";
import { platformNames } from "../config/publishing";

export default function PostStatusPage() {
  const { videoId } = useParams();
  const userId = useSelector((s: RootState) => s.auth.user?.userId) || "";
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const refresh = async () => {
    try {
      setError("");
      setData(
        (await videosApi.getSocialUploadStatus(userId, videoId || "")).data,
      );
    } catch {
      setError("Delivery status could not be loaded.");
    }
  };
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const r = await videosApi.getSocialUploadStatus(userId, videoId || "");
        if (active) {
          setData(r.data);
          setError("");
        }
      } catch {
        if (active) setError("Delivery status could not be loaded.");
      }
    };
    load();
    const timer = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [userId, videoId]);
  const results = Object.entries(data?.results || {}) as Array<[string, any]>;
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Delivery</p>
          <h1>Post status</h1>
          <p>Follow each destination as it processes your content.</p>
          <div className="gd-card-actions">
            <Button className="gd-card-action" variant="outlined" onClick={refresh}>Refresh status</Button>
          </div>
        </div>
      </header>
      {error && <Alert severity="error">{error}</Alert>}
      {!data && !error && (
        <WorkspaceSkeleton label="Loading delivery status" kind="list" />
      )}
      {data && (
        <>
          <div className="gd-inline-heading">
            <h2>
              {data.status === "idle"
                ? "No delivery in progress"
                : data.status === "completed"
                  ? "Delivery results"
                  : "Publishing progress"}
            </h2>
            <Chip label={data.status || "Unknown"} />
          </div>
          {data.error && <Alert severity="error">{data.error}</Alert>}
          <div className="gd-delivery-list">
            {results.map(([target, result]) => {
              const platform = target.split(":")[0];
              const status =
                result.status || (result.success ? "published" : "pending");
              const url = result.postUrl || result.url;
              return (
                <article key={target}>
                  <div>
                    <h3>{platformNames[platform] || platform}</h3>
                    <p>{status}</p>
                    {result.error && <p>{result.error}</p>}
                  </div>
                  {url && (
                    <a
                      className="gd-text-link"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open post ↗
                    </a>
                  )}
                </article>
              );
            })}
          </div>
          <p className="gd-quiet">
            Upload acceptance and publication are separate steps. If a result is
            unclear, check the destination before sending again.
          </p>
        </>
      )}
      <div className="gd-actions">
        <Link className="gd-text-link" to="/settings/scheduled-content">
          Posts & calendar →
        </Link>
        <Link className="gd-text-link" to="/media">
          Media library →
        </Link>
      </div>
    </div>
  );
}
