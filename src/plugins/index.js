// import i18n from "./vue-i18n";
import apollo from "./vue-apollo";
import element from "./element-plus";
import sentry from "./sentry";
import importcss from "./importcss";
import commonFn from "./commonFn";
import protectedFetch from "./protectedFetch";

const plugins = [apollo, element, importcss, commonFn, protectedFetch];

// Conditionally add Sentry if the environment variable VITE_ENABLE_SENTRY_PLUGIN is set to true
if (import.meta.env.VITE_ENABLE_SENTRY_PLUGIN === "true") {
  plugins.push(sentry);
}

export default plugins;
