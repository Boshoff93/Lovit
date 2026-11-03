import React, { useState } from "react";
import { Alert, Button } from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

export default function WorkspaceNotice({
  children,
  severity = "error",
  onRetry,
}: {
  children: React.ReactNode;
  severity?: "error" | "warning" | "info" | "success";
  onRetry?: () => unknown;
}) {
  const [retrying, setRetrying] = useState(false);
  const retry = async () => {
    setRetrying(true);
    try {
      await onRetry?.();
    } catch {
      /* The owning view keeps its error state. */
    } finally {
      setRetrying(false);
    }
  };
  return (
    <Alert
      severity={severity}
      className="gd-notice"
      action={
        onRetry && (
          <Button
            variant="outlined"
            size="small"
            onClick={retry}
            disabled={retrying}
            startIcon={<RefreshRoundedIcon />}
            aria-busy={retrying}
          >
            {retrying ? "Trying again…" : "Try again"}
          </Button>
        )
      }
    >
      {children}
    </Alert>
  );
}
