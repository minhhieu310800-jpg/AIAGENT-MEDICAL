import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Khi chạy `npm run dev`, các đường dẫn API được chuyển tiếp tới FastAPI (mặc định cổng 8000).
const API = process.env.VITE_API_TARGET || "http://localhost:8000";
const paths = ["/chat", "/sessions", "/auth", "/me", "/firebase-config", "/health", "/predict"];

export default defineConfig({
  plugins: [react()],
  server: { proxy: Object.fromEntries(paths.map((p) => [p, { target: API, changeOrigin: true }])) },
  build: { outDir: "dist", sourcemap: false },
});
