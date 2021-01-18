import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from "./store/index"
import * as util from '@/utils/util';
Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$util = util;
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
export default Vue;
