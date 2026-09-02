const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = __dirname;
const cache = path.join(os.homedir(), "Library", "Caches", "nutrician-app");

function run(command, args, cwd) {
  const env = { ...process.env };
  delete env.npm_config_devdir;
  delete env.NPM_CONFIG_DEVDIR;
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env,
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("NUTRICIAN");
console.log("Preparing a local copy (this project lives on iCloud Desktop)…");

fs.mkdirSync(cache, { recursive: true });
run("rsync", [
  "-a",
  "--delete",
  "--exclude", "node_modules",
  "--exclude", ".next",
  "--exclude", "dist",
  "--exclude", ".git",
  `${root}/`,
  `${cache}/`,
], root);

if (!fs.existsSync(path.join(cache, "node_modules", "vite"))) {
  console.log("Installing dependencies…");
  run("npm", ["install", "--no-fund", "--no-audit"], cache);
}

console.log("Building…");
run(process.execPath, [path.join(cache, "node_modules/vite/bin/vite.js"), "build"], cache);

process.chdir(cache);
require(path.join(cache, "serve.js"));
