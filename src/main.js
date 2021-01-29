import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import store from "./store/index"
import * as util from '@/utils/util';
import * as plugs from "@/utils/plugs.js"
const eCharts = require('echarts')
Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$util = util;
Vue.prototype.$plugs = plugs;
Vue.prototype.$eCharts = eCharts;
Vue.prototype.$goTree = function(params={}){
    uni.navigateTo({
      url:"/pages/public-page/select-division"+"?params="+JSON.stringify(params)
  })
}
Vue.prototype.$toTree = function(params = {}){
  this.$store.commit('setCheckedParams', params);
  uni.navigateTo({
      url: "/pages/public-page/select-divisions"
  })
}
//刷新保存状态
if (sessionStorage.getItem("store")) {
  store.replaceState(
      Object.assign(
          {},
          store.state,
          JSON.parse(sessionStorage.getItem("store"))
      )
  );
  sessionStorage.removeItem("store")
}

//监听，在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("store", JSON.stringify(store.state));
});

App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
export default Vue;
