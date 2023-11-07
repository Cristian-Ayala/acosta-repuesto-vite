import ElementPlus, { ElLoading } from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/theme-chalk/src/loading.scss";

export default ({ app }) => {
  /* eslint-disable no-param-reassign */
  app.config.globalProperties.$loading = ElLoading.service;
  app.use(ElementPlus);
  Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
    app.component(key, component);
  });
};
