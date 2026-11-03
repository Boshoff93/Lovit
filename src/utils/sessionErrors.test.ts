import { shouldClearSession } from "./sessionErrors";

test.each([
  [401, { error: "Token expired" }],
  [403, { error: "Invalid credentials" }],
  [403, { error: "Invalid token" }],
])(
  "a rejected current session ends the signed-in workspace (%s)",
  (status, data) => {
    expect(shouldClearSession(status, data, "current", "current")).toBe(true);
  },
);

test.each([
  [401, { error: "YouTube not connected" }],
  [401, { error: "TikTok not connected" }],
  [401, { error: "YouTube authorization expired. Please reconnect your YouTube account." }],
  [401, { error: "TikTok authorization expired. Please reconnect your TikTok account." }],
  [403, { error: "Publishing plan required" }],
  [403, { error: "Email verification required" }],
  [403, { error: "Account access denied" }],
  [429, { error: "Rate limit exceeded" }],
  [503, { error: "Account access could not be verified" }],
])(
  "permission, billing and transient failures preserve the session (%s)",
  (status, data) => {
    expect(shouldClearSession(status, data, "current", "current")).toBe(false);
  },
);

test("an old in-flight request cannot sign out a newly signed-in account", () => {
  expect(
    shouldClearSession(403, { error: "Invalid credentials" }, "old", "new"),
  ).toBe(false);
  expect(shouldClearSession(401, {}, null, null)).toBe(false);
});
