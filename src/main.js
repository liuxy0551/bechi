import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import 'src/styles/myIndex.less' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI, {size: 'medium'})

import axios from 'src/utils/myAxios';
Vue.prototype.$http = axios;
import api from 'src/api/api'
Vue.prototype.$api = api;
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {loading:"/static/images/spinner.svg" });
import TableCellImg from "src/components/TableCellImg";
Vue.component('table-cell-img',TableCellImg);
import Pagination from "src/components/Pagination";
Vue.component('pagination',Pagination);


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
