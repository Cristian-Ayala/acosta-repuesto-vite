import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createStore } from './store';
import App from './App.vue';
import routes from './router';
import isLoggedIn from './router/middleware/auth';
import 'element-plus/dist/index.css';

const router = createRouter({
  history: createWebHistory(),
  // base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.allowAnonymous)) next()
  else if (!(await isLoggedIn())) next({ name: 'Login' })
  else next()
  // to.name !== 'Login' &&
})

const app = createApp(App);
app.config.globalProperties.$url = import.meta.env.VITE_BACKEND_URL;
app.config.errorHandler = function errorHandler(err, instance, info) {
  window.console.error(err, instance, info);
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
  throw err;
};
app.config.warnHandler = (msg, instance, trace) => {
  window.console.warn(msg, instance, trace);
};
app.config.performance = true;
const store = createStore(app);
app.use(store);
app.use(router);
app.use(ElementPlus);
Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
  app.component(key, component);
});
app.mount('#app');
