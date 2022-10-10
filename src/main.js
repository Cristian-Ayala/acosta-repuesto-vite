import { createApp } from 'vue';
// import './registerServiceWorker'
import { createRouter, createWebHistory } from 'vue-router';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createStore } from './store';
import App from './App.vue';
import routes from './router';
import 'element-plus/dist/index.css';

const router = createRouter({
  history: createWebHistory(),
  // base: process.env.BASE_URL,
  routes,
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
});

const app = createApp(App);
app.config.globalProperties.$url = 'https://www.couchdb.tk/';
const store = createStore(app);
app.use(store);
app.use(router);
app.use(ElementPlus);
Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
  app.component(key, component);
});
app.mount('#app');
