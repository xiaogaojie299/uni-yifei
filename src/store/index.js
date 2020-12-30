import vuex from 'vuex';
import Vue from 'vue';
import {getThreeAreaCascadeList} from "../utils/api";
Vue.use(vuex);
let store = new vuex.Store({
    state:{
        areaList:[]     //区域下拉列表
    },
    mutations:{
        setAreaList(state,list){
            state.areaList = list
        }
    },
    actions:{
        async getAreaList(context){
           let {code,result,message}= await getThreeAreaCascadeList();
            if(code==200){
                this.context.commit('setAreaList',result)
            }
        }
    },
    modules: {}
})
export default store