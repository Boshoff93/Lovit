const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../build");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
function proxyApi(req, res, requestPath) {
  // Keep localhost requests on one origin. The upstream is fixed, never supplied by the caller.
  const headers = { ...req.headers, host: "api.agentgruvi.com" };
  for (const name of ["origin", "referer", "connection"]) delete headers[name];
  const upstream = https.request(
    {
      hostname: "api.agentgruvi.com",
      port: 443,
      path: requestPath,
      method: req.method,
      headers,
    },
    (response) => {
      const responseHeaders = {
        ...response.headers,
        "cache-control": "no-store",
      };
      for (const name of [
        "connection",
        "transfer-encoding",
        "access-control-allow-origin",
        "access-control-allow-credentials",
      ])
        delete responseHeaders[name];
      if (responseHeaders["set-cookie"])
        responseHeaders["set-cookie"] = responseHeaders["set-cookie"].map(
          (cookie) => cookie.replace(/;\s*Domain=[^;]+/gi, ""),
        );
      res.writeHead(response.statusCode || 502, responseHeaders);
      response.pipe(res);
    },
  );
  upstream.setTimeout(30000, () => upstream.destroy());
  upstream.on("error", () => {
    if (!res.headersSent) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "The Gruvi API could not be reached. Try again shortly.",
        }),
      );
    } else res.destroy();
  });
  req.on("aborted", () => upstream.destroy());
  req.pipe(upstream);
}
http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }
    if (pathname.startsWith("/api/") || pathname.startsWith("/auth/")) {
      proxyApi(req, res, url.pathname + url.search);
      return;
    }
    let file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    } catch {}
    let status = 200;
    try {
      if (!fs.statSync(file).isFile()) file = path.join(root, "index.html");
    } catch {
      file = path.join(root, "index.html");
    }
    const stream = fs.createReadStream(file);
    stream.once("error", () => {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      res.writeHead(503, {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "2",
      });
      res.end("The local preview is rebuilding. Refresh in a moment.");
    });
    stream.once("open", () => {
      res.writeHead(status, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      stream.pipe(res);
    });
  })
  .listen(3031, "127.0.0.1", () => console.log("Local: http://127.0.0.1:3031"));
