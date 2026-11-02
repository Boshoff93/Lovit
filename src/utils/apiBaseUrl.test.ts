import { getApiBaseUrl } from "./apiBaseUrl";

test("the local preview uses its same-origin API proxy", () => {
  expect(
    getApiBaseUrl({
      hostname: "127.0.0.1",
      port: "3031",
      origin: "http://127.0.0.1:3031",
    }),
  ).toBe("http://127.0.0.1:3031");
  expect(
    getApiBaseUrl({
      hostname: "localhost",
      port: "3031",
      origin: "http://localhost:3031",
    }),
  ).toBe("http://localhost:3031");
});
test("production and other hosts use the current Gruvi API", () => {
  for (const hostname of ["agentgruvi.com", "example.test"]) {
    expect(
      getApiBaseUrl({
        hostname,
        port: "3031",
        origin: `https://${hostname}:3031`,
      }),
    ).toBe("https://api.agentgruvi.com");
  }
  expect(getApiBaseUrl()).toBe("https://api.agentgruvi.com");
  expect(
    getApiBaseUrl({
      hostname: "localhost",
      port: "3000",
      origin: "http://localhost:3000",
    }),
  ).toBe("https://api.agentgruvi.com");
});
