import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access via IP or domain
    port: 5173, // Or any port you're using
    // Remove hardcoded origin - use environment variable if needed
    // origin: process.env.VITE_ORIGIN_URL,
    strictPort: true, // Optional: prevent port fallback
    allowedHosts :["b91f1cd30145.ngrok-free.app"],
  },
});
