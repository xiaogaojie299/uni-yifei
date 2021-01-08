import vuex from 'vuex';
import Vue from 'vue';
import {getMenu, getThreeAreaCascadeList} from "../utils/api";
Vue.use(vuex);
let store = new vuex.Store({
    state:{
        areaList:[],     //区域下拉列表
        permissionKeyList: [], // 权限KEY列表
        permissionList: [], // 权限列表(元数据)
    },
    mutations:{
        setAreaList(state,list){
            state.areaList = list
        },
        setPermissionList(state, list) {
            state.permissionList = list;
            uni.setStorageSync('cache:user:permission:list', list);
        },
        setPermissionKeyList(state, list) {
            state.permissionKeyList = list;
            uni.setStorageSync('cache:user:permission:key:list', list);
        }
    },
    actions:{
        async getAreaList(context){
           let {code,result,message}= await getThreeAreaCascadeList();
            if(code==200){
                this.context.commit('setAreaList',result)
            }
        },
        setPermissionList(context) {
            getMenu().then(resp => {
                if (resp.code == 200) {
                    let result = resp.result;
                    // 存入元数据
                    context.commit('setPermissionList', result.auth);
                    // 替换后存入修饰后的数据
                    let keys = result.auth.map(item => {
                        return item.action;
                    });
                    context.commit('setPermissionKeyList', keys);
                }
            });
        }
    },
    modules: {}
})
export default store