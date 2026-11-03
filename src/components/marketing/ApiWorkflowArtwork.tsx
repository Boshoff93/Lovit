import React from "react";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FlareRoundedIcon from "@mui/icons-material/FlareRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CodeExample from "../CodeExample";
import { PlatformIcon, publishingPlatforms } from "./DistributionShowcase";
import "./ApiWorkflowArtwork.css";

const request = `{
  "requestId": "morning-post-001",
  "videoId": "your-video-id",
  "platforms": [{
    "platform": "instagram",
    "accountId": "your-account-id"
  }],
  "scheduledTime": "2026-12-01T09:00:00Z"
}`;

function channelRoute(index: number) {
  const x = 50 + index * 100;
  return x < 300
    ? `M300 0 V20 Q300 32 288 32 H${x + 12} Q${x} 32 ${x} 44 V72`
    : `M300 0 V20 Q300 32 312 32 H${x - 12} Q${x} 32 ${x} 44 V72`;
}

export default function ApiWorkflowArtwork() {
  return (
    <figure
      className="gr-api-workflow"
      aria-label="Example of Codex, Gemini or Claude scheduling a video through Gruvi for connected social channels"
    >
      <div className="gr-api-agent-stack">
        <div className="gr-api-agent-layer gr-api-agent-claude">
          <span className="gr-api-agent-mark">
            <FlareRoundedIcon />
          </span>
          <span>Claude</span>
        </div>
        <div className="gr-api-agent-layer gr-api-agent-gemini">
          <span className="gr-api-agent-mark">
            <AutoAwesomeRoundedIcon />
          </span>
          <span>Gemini</span>
        </div>
        <div className="gr-api-request">
          <div className="gr-api-request-origin">
            <span className="gr-api-terminal-icon">
              <TerminalRoundedIcon />
            </span>
            <span>
              Codex <small>Your agent. One authenticated request.</small>
            </span>
            <span className="gr-api-example-label">Example</span>
          </div>
          <div className="gr-api-media">
            <img
              src="/marketing/slow-mornings-thumbnail.webp"
              alt=""
              width="42"
              height="48"
            />
            <div>
              <strong>Slow mornings.</strong>
              <span>Finished video + thumbnail</span>
            </div>
            <span className="gr-api-ready">
              <CheckRoundedIcon /> Ready
            </span>
          </div>
          <CodeExample label="POST /api/gruvi/scheduled-posts" code={request} />
        </div>
      </div>
      <div className="gr-api-connector" aria-hidden="true">
        <span />
      </div>
      <div className="gr-api-dispatch">
        <img src="/gruvi.png" alt="" width="44" height="44" />
        <div>
          <strong>Gruvi</strong>
          <span>Schedule accepted</span>
        </div>
        <span className="gr-api-response">
          <CalendarMonthRoundedIcon /> 201 Created
        </span>
      </div>
      <div className="gr-api-channel-map" aria-hidden="true">
        <svg viewBox="0 0 600 72" preserveAspectRatio="none" fill="none">
          {publishingPlatforms.map((platform, index) => (
            <g
              key={platform.id}
              style={
                { "--route-delay": `${index * -0.8}s` } as React.CSSProperties
              }
            >
              <path className="gr-api-route" d={channelRoute(index)} />
              <path
                className="gr-api-packet"
                pathLength="1"
                d={channelRoute(index)}
              />
            </g>
          ))}
        </svg>
        <div className="gr-api-channel-list">
          {publishingPlatforms.map((platform) => (
            <div
              key={platform.id}
              style={
                { "--channel-color": platform.color } as React.CSSProperties
              }
            >
              <span>
                <PlatformIcon id={platform.id} />
              </span>
              <small>{platform.name}</small>
            </div>
          ))}
        </div>
      </div>
      <figcaption>
        <span>One API. Your chosen channels.</span>
      </figcaption>
    </figure>
  );
}
