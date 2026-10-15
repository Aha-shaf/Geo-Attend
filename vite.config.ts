import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss({ optimize: false }),
    tanstackStart({
      // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
      // nitro/vite builds from this
      server: { entry: "./src/server.ts" },
    }),
    // React Refresh (required by TanStack Start dev mode) — must come after tanstackStart.
    viteReact(),
  ],
  resolve: {
    alias: {
      // Matches the "@/*" paths entry in tsconfig.json.
      "@": path.resolve(dirname, "./src"),
    },
  },
});
