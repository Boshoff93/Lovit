import React from "react";
import { Skeleton } from "@mui/material";

export default function WorkspaceSkeleton({
  label = "Loading workspace",
  rows = 3,
  kind = "cards",
  calendarView = "month",
}: {
  label?: string;
  rows?: number;
  kind?: "cards" | "list" | "calendar";
  calendarView?: "month" | "week" | "day";
}) {
  if (kind === "calendar") {
    const columns = calendarView === "day" ? 1 : 7;
    const weeks = calendarView === "month" ? 5 : 1;
    return (
      <div
        className={`gd-calendar-skeleton is-${calendarView}`}
        role="status"
        aria-label={label}
        aria-busy="true"
        style={
          {
            "--calendar-columns": columns,
            "--calendar-rows": weeks,
          } as React.CSSProperties
        }
      >
        <div className="gd-calendar-skeleton-days" aria-hidden="true">
          {Array.from({ length: columns }, (_, i) => (
            <span key={i}>
              <Skeleton variant="rounded" width={24} height={8} />
            </span>
          ))}
        </div>
        <div className="gd-calendar-skeleton-grid" aria-hidden="true">
          {Array.from({ length: columns * weeks }, (_, i) => (
            <div className="gd-calendar-placeholder-day" key={i}>
              <Skeleton variant="rounded" width={12} height={8} />
              {[2, 9, 17, 23].includes(i) && (
                <Skeleton variant="rounded" width="85%" height={18} />
              )}
            </div>
          ))}
        </div>
        <span className="gd-sr-only">{label}</span>
      </div>
    );
  }
  return (
    <div
      className={`gd-loading-shell gd-loading-${kind}`}
      role="status"
      aria-label={label}
      aria-busy="true"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div className="gd-loading-card" key={index} aria-hidden="true">
          <Skeleton variant="rounded" width="32%" height={16} />
          <Skeleton
            variant="rounded"
            width="64%"
            height={kind === "cards" ? 44 : 20}
          />
          <Skeleton variant="rounded" width="90%" height={14} />
        </div>
      ))}
      <span className="gd-sr-only">{label}</span>
    </div>
  );
}
