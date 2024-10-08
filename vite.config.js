import { resolve } from "path";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
// eslint-disable-next-line import/no-extraneous-dependencies
import { VitePWA } from "vite-plugin-pwa";

export const aliases = {
  "@": resolve(__dirname, "./src"),
};

// const mode = process.env.APP_ENV

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      sourcemap: true,
      target: "esnext",
      rollupOptions: {
        output: {
          format: "esm",
        },
      },
    },
    resolve: {
      alias: aliases,
    },
    define: {
      "process.env.NODE_ENV": mode === "development" || `"${mode}"`,
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: "@use '@/assets/scss/customTheme.scss' as *;",
        },
      },
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
          id: "3.2.0",
          version: "2.0.1",
          manifest_version: 1,
          name: `${env.VITE_CLIENT_NAME}`,
          short_name: `${env.VITE_CLIENT_NAME}`,
          app_name: `${env.VITE_CLIENT_NAME}`,
          description: "Manage inventory and catalogs",
          theme_color: "#b12525",
          start_url: "/",
          display_override: ["standalone", "minimal-ui"],
          display: "standalone",
          background_color: "#fff",
          icons: [
            {
              src: `img/${env.VITE_CLIENT_PWA_ICON_NAME || ""}192x192.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: `img/maskable_icon${env.VITE_CLIENT_PWA_ICON_NAME ? `_${env.VITE_CLIENT_PWA_ICON_NAME}` : ""}_x192.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: `img/${env.VITE_CLIENT_PWA_ICON_NAME || ""}512x512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: `img/maskable_icon${env.VITE_CLIENT_PWA_ICON_NAME ? `_${env.VITE_CLIENT_PWA_ICON_NAME}` : ""}_x512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          screenshots: [
            {
              src: "screenshots/home1.png",
              sizes: "374x664",
              type: "image/png",
              form_factor: "narrow",
              label: "Home screen",
            },
            {
              src: "screenshots/home2.png",
              sizes: "374x664",
              type: "image/png",
              form_factor: "narrow",
              label: "Home screen",
            },
            {
              src: "screenshots/home4.png",
              sizes: "374x664",
              type: "image/png",
              form_factor: "narrow",
              label: "Home screen",
            },
            {
              src: "screenshots/home5.png",
              sizes: "374x664",
              type: "image/png",
              form_factor: "wide",
              label: "Home screen",
            },
            {
              src: "screenshots/home6.png",
              sizes: "374x664",
              type: "image/png",
              form_factor: "narrow",
              label: "Home screen",
            },
          ],
        },
      }),
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        telemetry: env.SENTRY_TELEMETRY === "true",
      }),
    ],
  };
});
