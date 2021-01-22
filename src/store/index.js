import vuex from 'vuex';
import Vue from 'vue';
import {getMenu, getThreeAreaCascadeList, getMyDepartmentTreeList} from "../utils/api";
import createPersistedState from 'vuex-persistedstate'; // vuex数据状态state持久化存储


Vue.use(vuex);
let store = new vuex.Store({
    state:{
        areaList:[],     //区域下拉列表
        permissionKeyList: [], // 权限KEY列表
        permissionList: [], // 权限列表(元数据)
        unitValue:{},   // 单位部门选择 列表
        treeData:[],    // 树状图默认省，市，区，医院，科室...
        leftTreeData:[],    // 用户管路 left-tree组件中的数数据。。。。。。。。。。。
        checkedNodes:{} //选择的树节点
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
        },
        setUnitValue(state,list){
            state.unitValue = list;
            uni.setStorageSync("unitValue",JSON.stringify(list));
        },
        setTreeData(state,list){
            state.treeData = list
        },
        setLeftTreeData(state,list){
            state.leftTreeData = list
        },
        setCheckedNodes(state,obj){
            console.log("obj==>",obj);
            state.checkedNodes = obj
        }
    },
    actions:{
        async getAreaList(context){
           let {code,result,message}= await getThreeAreaCascadeList();
            if(code==200){
                this.context.commit('setAreaList',result)
            }
        },
        async getLeftTreeData(context){
            getMyDepartmentTreeList().then(({code,result})=>{
                if(code==200){
                    context.commit('setLeftTreeData', result);
                }
            })
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
        },
        getTreeData(context){
            getMyDepartmentTreeList().then(({code,result})=>{
                if(code==200){
                    context.commit('setTreeData', result);
                }
            })
        }
    },
    modules: {
        plugins: [createPersistedState({
	        storage: window.localStorage,   //sessionStorage和localStorage自行切换
	        reducer (val) {
	            return {
	                guideId: val.guideId,
	            };
	        }
	    })]
    }
})
export default store