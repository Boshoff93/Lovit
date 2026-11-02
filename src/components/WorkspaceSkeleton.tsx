import React from 'react';
import { Skeleton } from '@mui/material';

export default function WorkspaceSkeleton({ label = 'Loading workspace', rows = 3, kind = 'cards' }: { label?: string; rows?: number; kind?: 'cards' | 'list' | 'calendar' }) {
  return (
    <div className={`gd-loading-shell gd-loading-${kind}`} role="status" aria-label={label} aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <div className="gd-loading-card" key={index} aria-hidden="true">
          <Skeleton variant="rounded" width="32%" height={16} />
          <Skeleton variant="rounded" width="64%" height={kind === 'cards' ? 44 : 20} />
          <Skeleton variant="rounded" width="90%" height={14} />
        </div>
      ))}
      <span className="gd-sr-only">{label}</span>
    </div>
  );
}
