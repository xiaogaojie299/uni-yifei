import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from "./store/index"
import * as util from '@/utils/util';
const eCharts = require('echarts')
Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$util = util;
Vue.prototype.$eCharts = eCharts
Vue.prototype.$goTree = function(params={}){
    uni.navigateTo({
      url:"/pages/public-page/select-division"+"?params="+JSON.stringify(params)
  })
}
Vue.prototype.$toTree = function(params = {}){
  this.$store.commit('setCheckedNodes', params);
  uni.navigateTo({
      url: "/pages/public-page/select-divisions"
  })
}
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
export default Vue;
