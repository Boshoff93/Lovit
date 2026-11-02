import React from "react";
import PublishingPlans from "../components/PublishingPlans";
export default function DashboardSubscriptionPage() {
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Plan & billing</p>
          <h1>Your publishing plan</h1>
          <p>
            Keep exploring for free. Choose a plan when you're ready to publish
            or schedule.
          </p>
        </div>
      </header>
      <PublishingPlans />
    </div>
  );
}
