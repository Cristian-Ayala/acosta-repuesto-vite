import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";


export default ({ app }) => {
  app.use(ElementPlus);
  Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
    app.component(key, component);
  });
};