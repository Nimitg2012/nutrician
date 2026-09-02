const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 3000);
const hostname = "127.0.0.1";
const dist = path.join(__dirname, "dist");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
};

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-cache",
  });
  res.end(body);
}

function readFile(filePath) {
  try {
    if (!fs.statSync(filePath).isFile()) return null;
    return fs.readFileSync(filePath);
  } catch {
    return null;
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${hostname}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  const requested = path.normalize(path.join(dist, pathname));
  if (!requested.startsWith(dist)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  const exact = readFile(requested);
  if (exact) {
    send(res, 200, exact, TYPES[path.extname(requested)] || "application/octet-stream");
    return;
  }

  const fallback = readFile(path.join(dist, "index.html"));
  if (!fallback) {
    send(res, 503, "Nutrician has not been built yet.", "text/plain; charset=utf-8");
    return;
  }
  send(res, 200, fallback, TYPES[".html"]);
});

server.listen(port, hostname, () => {
  console.log("");
  console.log("NUTRICIAN");
  console.log("Running at:");
  console.log(`http://localhost:${port}`);
  console.log("");
});
