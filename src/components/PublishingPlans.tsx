import React, { useState } from "react";
import { Alert, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import api from "../utils/axiosConfig";
import { createPortalSession } from "../store/authSlice";
import { publishingPlans } from "../config/publishing";
import DistributionAuthDialog from "./DistributionAuthDialog";

export default function PublishingPlans() {
  const { token, subscription } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
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
    <>
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
            <p>{plan.description}</p>
            <strong>{plan.posts} scheduled posts / month</strong>
            <ul>
              <li>Connected social accounts</li>
              <li>Video uploads & custom thumbnails</li>
              <li>Immediate publishing & scheduling</li>
              <li>HTTP API & MCP server access</li>
              <li>TikTok & YouTube analytics</li>
            </ul>
            <Button
              variant={plan.id === "scale" ? "contained" : "outlined"}
              onClick={() => choose(plan)}
              disabled={!!busy}
            >
              {busy === plan.id
                ? "Opening billing..."
                : paid
                  ? "Manage subscription"
                  : "Choose " + plan.name}
            </Button>
          </article>
        ))}
      </div>
      <p className="gd-quiet gd-pricing-note">
        USD, billed monthly. One scheduled post can target several connected
        accounts. Existing subscribers can manage their current subscription in
        billing. Applicable taxes are shown at checkout.
      </p>
      <p className="gd-quiet">
        Immediate publishing is included. The monthly allowance applies to
        scheduled posts.{" "}
        <Link to="/docs/social">Platform rules and limits still apply.</Link>
      </p>
      {!token && (
        <p className="gd-quiet">
          Create your account and explore the workspace first. Choose a plan
          when you're ready to send.
        </p>
      )}
      <DistributionAuthDialog
        open={auth}
        onClose={() => {
          setAuth(false);
          if (token) navigate("/payment");
        }}
      />
    </>
  );
}
