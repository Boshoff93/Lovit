import React, { useState } from "react";
import { Alert, Button } from "@mui/material";
import {
  CalendarMonthOutlined,
  CheckRounded,
  InsightsOutlined,
  PlaylistAddOutlined,
  SupportAgentOutlined,
  UploadFileOutlined,
  ViewCarouselOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import api from "../utils/axiosConfig";
import { createPortalSession } from "../store/authSlice";
import { publishingPlans } from "../config/publishing";
import DistributionAuthDialog from "./DistributionAuthDialog";

const sharedBenefits = [
  {
    title: "Video posts & custom thumbnails",
    description: "Publish finished videos with your own captions and thumbnails.",
    icon: UploadFileOutlined,
    href: "/docs/getting-started",
  },
  {
    title: "Your publishing calendar",
    description: "Plan ahead and track scheduled posts and delivery in one place.",
    icon: CalendarMonthOutlined,
    href: "/docs/social",
  },
  {
    title: "Image carousels",
    description: "Prepare image sequences for Instagram and TikTok photo posts.",
    icon: ViewCarouselOutlined,
    href: "/blog/instagram-tiktok-carousel-posts",
  },
  {
    title: "Bulk video scheduling",
    description: "Queue a batch of videos, then set the timing and caption for each.",
    icon: PlaylistAddOutlined,
    href: "/blog/bulk-video-scheduling",
  },
  {
    title: "Social analytics",
    description: "Instagram and YouTube analytics. TikTok, X and Facebook analytics coming soon. Platform permissions apply.",
    icon: InsightsOutlined,
    href: "/blog/social-media-analytics-api",
  },
  {
    title: "Founder support",
    description: "Get help directly from the person building Gruvi.",
    icon: SupportAgentOutlined,
    href: "mailto:admin@wbtechventures.com",
  },
];

export default function PublishingPlans() {
  const { token, subscription } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const usedTrial = useSelector((s: RootState) => Boolean((s.auth.user as any)?.hasUsedTrial));
  const paid = !!subscription?.tier && subscription.tier !== "free";
  const choose = async (plan: (typeof publishingPlans)[number]) => {
    if (!token) {
      setAuth(true);
      return;
    }
    setBusy(plan.id);
    setError("");
    try {
      if (paid) {
        const result = await dispatch(createPortalSession());
        if (
          !result.type.endsWith("/fulfilled") ||
          !(result.payload as any)?.url
        )
          throw new Error("Billing could not be opened.");
        window.location.assign((result.payload as any).url);
      } else {
        const storageKey = "gruvi-checkout-" + plan.id;
        let attempt: any;
        try {
          attempt = JSON.parse(sessionStorage.getItem(storageKey) || "null");
        } catch {}
        if (!attempt || Date.now() - attempt.createdAt > 25 * 60 * 1000) {
          attempt = { requestId: crypto.randomUUID(), createdAt: Date.now() };
          sessionStorage.setItem(storageKey, JSON.stringify(attempt));
        }
        const requestId = attempt.requestId;
        const result = await api.post("/api/publishing/checkout", {
          planId: plan.id,
          requestId,
          trial: !usedTrial,
        });
        window.location.assign(result.data.checkoutUrl);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Checkout could not be opened.",
      );
    } finally {
      setBusy("");
    }
  };
  return (
    <div className="gd-publishing-plans">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <div className="gd-plan-grid">
        {publishingPlans.map((plan) => (
          <article
            key={plan.id}
            className={
              plan.id === "scale" ? "gd-plan gd-plan-featured" : "gd-plan"
            }
          >
            <img
              className="gd-plan-mascot"
              src={
                plan.id === "starter"
                  ? "/gruvi/gruvi-started.png"
                  : plan.id === "scale"
                    ? "/gruvi/gruvi-scale.png"
                    : "/gruvi/gruvi-beast.png"
              }
              alt=""
            />
            <p className="gd-eyebrow">{plan.name}</p>
            <h2>
              ${plan.price}
              <span> / month</span>
            </h2>
            <p className="gd-plan-description">{plan.description}</p>
            <strong>{plan.posts} scheduled posts / month</strong>
            <ul className="gd-plan-highlights" aria-label={`${plan.name} highlights`}>
              <li><CheckRounded aria-hidden="true" /><span>Publish now or schedule ahead</span></li>
              <li><CheckRounded aria-hidden="true" /><span>Multiple accounts per platform</span></li>
              <li><CheckRounded aria-hidden="true" /><Link to="/api">API included</Link></li>
              {plan.id !== "starter" && (
                <li><CheckRounded aria-hidden="true" /><Link to="/docs/agent-integration">MCP connector for agents</Link></li>
              )}
            </ul>
            <Button
              className="gd-plan-action gd-primary-action gd-card-action"
              variant="contained"
              onClick={() => choose(plan)}
              disabled={!!busy}
            >
              {busy === plan.id
                ? "Opening billing..."
                : paid
                  ? "Manage subscription"
                  : !usedTrial ? "Start 3-day trial" : "Choose " + plan.name}
            </Button>
          </article>
        ))}
      </div>
      <p className="gd-quiet gd-pricing-note">
        USD, billed monthly after the trial. New eligible accounts get one three-day trial. A payment method is required. Cancel before it ends to avoid the monthly charge. Existing subscribers can manage their current subscription in
        billing. Applicable taxes are shown at checkout.
      </p>
      <p className="gd-quiet">
        One scheduled post uses one slot, even when sent to several accounts.
        Each video in a scheduled batch counts as one post. Preparing media
        does not use your monthly post allowance. Immediate publishing is included.{" "}
        <Link to="/docs/social">Platform rules and limits still apply.</Link>
      </p>
      {!token && (
        <p className="gd-quiet">
          Create your account and explore the workspace first. Choose a plan
          when you're ready to send.
        </p>
      )}
      <section className="gd-plan-benefits" aria-labelledby="gd-plan-benefits-title">
        <header>
          <h2 id="gd-plan-benefits-title">Included in every plan</h2>
          <p>All the publishing tools below, whichever post allowance you choose.</p>
        </header>
        <ul className="gd-plan-benefits-grid">
          {sharedBenefits.map(({ title, description, icon: Icon, href }) => (
            <li key={title}>
              <span className="gd-plan-benefit-icon" aria-hidden="true"><Icon /></span>
              <div>
                <h3>{href.startsWith("/") ? <Link to={href}>{title}</Link> : <a href={href}>{title}</a>}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <DistributionAuthDialog
        open={auth}
        onClose={() => {
          setAuth(false);
          if (token) navigate("/payment");
        }}
      />
    </div>
  );
}
