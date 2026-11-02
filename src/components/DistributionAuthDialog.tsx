import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function DistributionAuthDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const widget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || !signup) return;
    let cancelled = false;
    let id: string | undefined;
    const render = () => {
      if (!cancelled && widget.current && (window as any).turnstile) {
        id = (window as any).turnstile.render(widget.current, {
          sitekey: "0x4AAAAAACVH3kKfzISLK2MH",
          theme: "dark",
          callback: setCaptcha,
          "expired-callback": () => setCaptcha(""),
          "error-callback": () => setCaptcha(""),
        });
      }
    };
    let script = document.getElementById(
      "turnstile-script",
    ) as HTMLScriptElement | null;
    if ((window as any).turnstile) render();
    else {
      if (!script) {
        script = document.createElement("script");
        script.id = "turnstile-script";
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", render);
    }
    return () => {
      cancelled = true;
      script?.removeEventListener("load", render);
      if (id) (window as any).turnstile?.remove(id);
      setCaptcha("");
    };
  }, [open, signup]);
  useEffect(() => {
    if (open) {
      setError("");
      setSuccess("");
    }
  }, [open]);
  const complete = (result: any) => {
    if (!result.type.endsWith("/fulfilled"))
      throw new Error(
        typeof result.payload === "string"
          ? result.payload
          : "Unable to sign in. Please try again.",
      );
    onClose();
    navigate(
      result.payload.user?.isVerified ? "/dashboard" : "/resend-verification",
    );
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (signup) {
        if (password !== confirm) throw new Error("Passwords do not match.");
        if (!/(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/.test(password))
          throw new Error(
            "Use at least 8 characters, including an uppercase letter, a number and a symbol.",
          );
        if (!captcha) throw new Error("Complete the security check.");
        const result = await auth.signup(email, password, name, captcha);
        if (!result.type.endsWith("/fulfilled"))
          throw new Error(
            typeof result.payload === "string"
              ? result.payload
              : "Unable to create your account.",
          );
        setSuccess(
          "Account created. Check your email to verify it, then sign in.",
        );
        setSignup(false);
      } else complete(await auth.login(email, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  };
  const google = async () => {
    setBusy(true);
    setError("");
    try {
      complete(await auth.googleLogin(await auth.getGoogleIdToken()));
    } catch {
      setError("Google sign-in did not complete. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="distribution-auth-title"
      PaperProps={{
        sx: {
          bgcolor: "#171e25",
          borderRadius: 3,
          border: "1px solid #ffffff18",
        },
      }}
    >
      <DialogTitle id="distribution-auth-title" sx={{ pr: 6 }}>
        {signup ? "Create your Gruvi account" : "Welcome to Gruvi"}
        <IconButton
          aria-label="Close sign in"
          onClick={onClose}
          disabled={busy}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          ×
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={submit} className="gd-auth-form">
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Button variant="outlined" onClick={google} disabled={busy}>
            Continue with Google
          </Button>
          <p>or continue with email</p>
          {signup && (
            <TextField
              label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          )}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={signup ? "new-password" : "current-password"}
          />
          {signup && (
            <>
              <TextField
                label="Confirm password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
              <div ref={widget} />
            </>
          )}
          <Button
            variant="contained"
            type="submit"
            disabled={busy || (signup && !captcha)}
          >
            {busy ? "Please wait..." : signup ? "Create account" : "Sign in"}
          </Button>
          <Button
            onClick={() => {
              setSignup(!signup);
              setError("");
            }}
            disabled={busy}
          >
            {signup
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </Button>
          {!signup && (
            <Link to="/reset-password-request" onClick={onClose}>
              Forgot your password?
            </Link>
          )}
          <p>
            By continuing, you agree to the{" "}
            <Link to="/terms" onClick={onClose}>
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" onClick={onClose}>
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
