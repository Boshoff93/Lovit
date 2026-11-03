/** Permission and plan errors must never sign an account out. */
export function isRejectedSession(status: unknown, data: unknown): boolean {
  if (status === 401) return true;
  if (status !== 403 || !data || typeof data !== "object") return false;
  const message = (data as { error?: unknown }).error;
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
