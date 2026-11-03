/** Permission and plan errors must never sign an account out. */
export function isRejectedSession(status: unknown, data: unknown): boolean {
  // Legacy video analytics use 401 for an expired social connection, even when
  // the Gruvi session is valid. One disconnected channel must not sign out all.
  const message = data && typeof data === 'object' ? (data as { error?: unknown }).error : undefined;
  if (status === 401 && typeof message === 'string' && [
    'YouTube not connected', 'TikTok not connected',
    'YouTube authorization expired. Please reconnect your YouTube account.',
    'TikTok authorization expired. Please reconnect your TikTok account.',
  ].includes(message)) return false;
  if (status === 401) return true;
  if (status !== 403 || !data || typeof data !== "object") return false;
  return message === "Invalid credentials" || message === "Invalid token";
}

export function shouldClearSession(
  status: unknown,
  data: unknown,
  requestToken: string | null | undefined,
  currentToken: string | null | undefined,
): boolean {
  return (
    !!requestToken &&
    requestToken === currentToken &&
    isRejectedSession(status, data)
  );
}
