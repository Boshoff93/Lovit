import React from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CollectionsRoundedIcon from "@mui/icons-material/CollectionsRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
export default function GuideArtwork({ variant }: { variant: string }) {
  const icon =
    variant === "bulk" ? (
      <CalendarMonthRoundedIcon />
    ) : variant === "carousel" ? (
      <CollectionsRoundedIcon />
    ) : variant === "analytics" ? (
      <BarChartRoundedIcon />
    ) : variant === "retries" ? (
      <ReplayRoundedIcon />
    ) : (
      <CodeRoundedIcon />
    );
  const labels: Record<string, string[]> = {
    agents: ["Your agent", "Gruvi", "Published"],
    bulk: ["01 · Monday", "02 · Wednesday", "03 · Friday"],
    carousel: ["01", "02", "03"],
    analytics: ["Views", "Engagement", "Coverage"],
    mcp: ["26 tools", "MCP", "Connected"],
    retries: ["Request ID", "Check status", "One post"],
  };
  return (
    <div className={`gr-guide-art is-${variant}`} aria-hidden="true">
      <div className="gr-art-grid" />
      <div className="gr-art-icon">{icon}</div>
      <div className="gr-art-labels">
        {(labels[variant] || labels.agents).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
