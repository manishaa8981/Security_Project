import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3000,
    https: {
      pfx: fs.readFileSync(path.resolve(__dirname, "../certs/key.pfx")),
      passphrase: "1234",
    },
  },
});
