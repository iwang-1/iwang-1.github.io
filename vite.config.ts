import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User site (iwang-1.github.io) — served from the domain root, so base is '/'.
// MPA: four HTML entries; React/shared components dedupe into shared chunks.
// Input paths are resolved against the project root (no node:path import —
// @types/node is deliberately not a dependency).
export default defineConfig({
  plugins: [react()],
  appType: "mpa", // dev server serves directory indexes, 404s unknown paths
  base: "/",
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        experience: "experience/index.html",
        projects: "projects/index.html",
        notFound: "404.html",
      },
    },
  },
});
