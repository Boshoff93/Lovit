import React from "react";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import PublishingPlans from "./PublishingPlans";
export default function PublishingPaywall({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#111820",
          border: "1px solid #ffffff20",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        Choose a plan to send your post
        <Button onClick={onClose} sx={{ float: "right" }}>
          Keep exploring
        </Button>
      </DialogTitle>
      <DialogContent className="gd">
        <p className="gd-lead" style={{ marginBottom: 28 }}>
          Account setup and the calendar are free to explore. Publishing and
          scheduling start at $10 per month.
        </p>
        <PublishingPlans />
      </DialogContent>
    </Dialog>
  );
}
