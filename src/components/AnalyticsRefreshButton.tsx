import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

export default function AnalyticsRefreshButton({ onClick, refreshing = false, disabled = false, label = 'Refresh analytics' }: {
  onClick: () => void; refreshing?: boolean; disabled?: boolean; label?: string;
}) {
  return <Tooltip title={refreshing ? 'Updating analytics' : label}>
    <span className="gd-analytics-refresh-wrap"><IconButton className={`gd-analytics-refresh${refreshing ? ' is-refreshing' : ''}`} aria-label={label} aria-busy={refreshing} disabled={disabled || refreshing} onClick={onClick}><RefreshRoundedIcon/></IconButton></span>
  </Tooltip>;
}
