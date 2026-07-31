import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api-sms': {
        target: 'https://textbelt.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sms/, '/text'),
      },
      '/api-twilio': {
        target: 'https://api.twilio.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-twilio/, ''),
      }
    }
  }
});