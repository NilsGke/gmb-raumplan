import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["icon.svg", "GMB-Logo.svg", "GMB-Logox512.jpg"],
      manifest: {
        name: "GMB - Raumplan",
        short_name: "GMB - Raumplan",
        description: "Der Raumplan des Gymnasiums am Mosbacher Berg",
        icons: [
          {
            src: "icon192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icon512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],

        theme_color: "#035eab",
        categories: ["navigation", "productivity"],
        display: "minimal-ui",
        display_override: ["minimal-ui", "browser"],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
});
