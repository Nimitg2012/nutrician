import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  appType: "spa",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.join(root, "src"),
      "next/link": path.join(root, "src/shims/next-link.tsx"),
      "next/navigation": path.join(root, "src/shims/next-navigation.ts"),
    },
  },
  optimizeDeps: {
    entries: ["src/main.tsx"],
    exclude: ["next"],
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
    watch: null,
  },
  preview: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
  },
});
