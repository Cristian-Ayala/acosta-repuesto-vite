import { createApp } from "vue";
import { createStore } from "./store";
import App from "./App.vue";
import "element-plus/dist/index.css";
import plugins from "./plugins/index";
import router from "./router";
import "./configureClient";

function installPlugins({ app }) {
  plugins.forEach((plugin) => {
    try {
      plugin({ app, router });
    } catch (error) {
      window.console.error(
        "Error occurred while loading plugin:",
        error,
        plugin,
      );
    }
  });
}

const app = createApp(App);
app.config.globalProperties.$url = import.meta.env.VITE_BACKEND_URL;
app.config.globalProperties.$FILE_MANAGER = `${import.meta.env.VITE_NESTJS_DOMAIN}/file-manager/`;
app.config.errorHandler = function errorHandler(err, instance, info) {
  window.console.error(err, instance, info);
  throw err;
};
app.config.warnHandler = (msg, instance, trace) => {
  window.console.warn(msg, instance, trace);
};
app.config.performance = true;
const store = createStore(app);
app.use(store);
app.use(router);
installPlugins({ app });
app.mount("#app");
