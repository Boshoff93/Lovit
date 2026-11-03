import WorkspaceSkeleton from "../components/WorkspaceSkeleton";
import WorkspaceNotice from "../components/WorkspaceNotice";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { AgentKey, userApi } from "../services/api";
import { mcpConfiguration } from "../config/agentDocs";
export default function AgentAccessPage() {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<AgentKey[]>([]);
  const [name, setName] = useState("");
  const [created, setCreated] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [revoke, setRevoke] = useState<string | null>(null);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setKeys((await userApi.listAgentKeys()).data.keys || []);
    } catch {
      setError("Agent keys could not be loaded.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await userApi.createAgentKey(name.trim());
      setCreated(result.data.key);
      setName("");
      await load();
    } catch {
      setError("The key could not be created.");
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!revoke) return;
    setBusy(true);
    try {
      await userApi.deleteAgentKey(revoke);
      setRevoke(null);
      await load();
    } catch {
      setError("The key could not be revoked.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="gd">
      <header className="gd-workspace-header">
        <div>
          <p className="gd-eyebrow">Agent access</p>
          <h1>Give your agent a publishing tool.</h1>
          <p>
            Create a key, configure the MCP server and choose when your agent
            may send content.
          </p>
        </div>
      </header>
      {error && <WorkspaceNotice onRetry={load}>{error}</WorkspaceNotice>}
      <div className="gd-agent-setup">
        <section className="gd-form-section">
          <h2>1. Create an agent key</h2>
          <p>
            Use a separate key for each agent or workflow. Keys can access your
            Gruvi account, so keep them in your client's secret settings.
          </p>
          <form onSubmit={create} className="gd-form">
            <TextField
              label="Key name"
              placeholder="My publishing agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Button
              className="gd-primary-action"
              type="submit"
              variant="contained"
              disabled={busy || !name.trim()}
            >
              Create key
            </Button>
          </form>
          {created && (
            <Alert severity="success">
              <strong>Copy this key now. It is shown once.</strong>
              <code className="gd-secret">{created}</code>
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(created);
                  } catch {
                    setError(
                      "Copy was unavailable. Select the key and copy it manually.",
                    );
                  }
                }}
              >
                Copy key
              </Button>
              <Button onClick={() => setCreated("")}>Hide key</Button>
            </Alert>
          )}
          {loading && (
            <WorkspaceSkeleton
              label="Loading agent keys"
              kind="list"
              rows={2}
            />
          )}
          <div className="gd-key-list">
            {keys.map((key) => (
              <div key={key.keyId}>
                <span>
                  <strong>{key.name}</strong>
                  <small>
                    Created {new Date(key.createdAt).toLocaleDateString()}
                  </small>
                </span>
                <Button color="error" onClick={() => setRevoke(key.keyId)}>
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </section>
        <section className="gd-form-section">
          <h2>2. Add the MCP server</h2>
          <p>
            Add the versioned Gruvi MCP bundle to your client. npx handles
            installation; Node.js 20 or newer is required.
          </p>
          <pre className="gd-code">{mcpConfiguration}</pre>
          <Link className="gd-text-link" to="/docs/agent-integration">
            Full setup and publishing guide ↗
          </Link>
          <p className="gd-quiet">
            No subscription is needed to configure your account. A paid plan is
            required when you publish or schedule.
          </p>
        </section>
      </div>
      <Dialog open={!!revoke} onClose={() => setRevoke(null)}>
        <DialogTitle>Revoke this agent key?</DialogTitle>
        <DialogContent>
          The agent will lose access. Existing scheduled posts keep their
          current schedule.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevoke(null)}>Keep key</Button>
          <Button color="error" disabled={busy} onClick={remove}>
            Revoke key
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
