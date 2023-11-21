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
          id: "3.0.6",
          version: "1.0.0",
          manifest_version: 1,
          name: "Acosta Repuestos",
          short_name: "Acosta Repuestos",
          app_name: "Acosta Repuestos",
          description: "Manage inventory and catalogs",
          theme_color: "#e94c63",
          start_url: "/",
          display: "standalone",
          background_color: "#e94c63",
          icons: [
            {
              src: "img/192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "img/maskable_icon_x192.png",
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
              src: "img/maskable_icon_x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
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
