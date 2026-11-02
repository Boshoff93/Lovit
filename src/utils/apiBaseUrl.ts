export function getApiBaseUrl(
  location?: Pick<Location, "hostname" | "port" | "origin">,
): string {
  const isLocalPreview =
    location &&
    ["localhost", "127.0.0.1"].includes(location.hostname) &&
    location.port === "3031";
  return isLocalPreview ? location.origin : "https://api.agentgruvi.com";
}

export const API_BASE_URL = getApiBaseUrl(
  typeof window === "undefined" ? undefined : window.location,
);
