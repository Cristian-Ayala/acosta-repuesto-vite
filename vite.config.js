import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import { VitePWA } from "vite-plugin-pwa";

export const aliases = {
  "@": resolve(__dirname, "./src"),
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: aliases,
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        id: "1.0.0",
        version: "1.0.0",
        manifest_version: 1,
        name: "Acosta Repuestos",
        short_name: "Acosta Repuestos",
        app_name: "Acosta Repuestos",
        description: "Manage inventory and catalogs",
        theme_color: "#e94c63",
        start_url: "/",
        display: "fullscreen",
        background_color: "#000000",
        icons: [
          {
            src: "img/192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "img/maskable_192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "img/512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "img/maskable_512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
