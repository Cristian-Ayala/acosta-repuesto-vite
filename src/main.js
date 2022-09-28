import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import { createStore } from './store'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './router'
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const router = createRouter({
    history: createWebHistory(),
    // base: process.env.BASE_URL,
    routes,
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'exact-active-link',
  })

const app = createApp(App)
app.config.globalProperties.$url = "https://www.couchdb.tk/";
const store = createStore(app)
app.use(store)
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
