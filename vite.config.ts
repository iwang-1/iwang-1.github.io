import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User site (iwang-1.github.io) — served from the domain root, so base is '/'.
export default defineConfig({
  plugins: [react()],
  base: "/",
});
