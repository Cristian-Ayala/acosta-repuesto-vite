import Vue from 'vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import {
  BootstrapVue
} from 'bootstrap-vue'
import Layout from './Layout.vue'
import VueInputAutowidth from 'vue-input-autowidth'
import VueAWN from "vue-awesome-notifications"
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueInputAutowidth)
Vue.use(VueAWN)
require("vue-awesome-notifications/dist/styles/style.css")
Vue.config.productionTip = false
Vue.config.silent = true

Vue.prototype.$url = "https://www.couchdb.me/";

new Vue({
  router,
  store,
  render: h => h(Layout)
}).$mount('#app')

