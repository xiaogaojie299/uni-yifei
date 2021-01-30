import vuex from 'vuex';
import Vue from 'vue';
import {getMenu, getThreeAreaCascadeList, getMyDepartmentTreeList,getRootTreeList,sysDepartmentTreeList } from "../utils/api";
import createPersistedState from 'vuex-persistedstate'; // vuex数据状态state持久化存储

Vue.use(vuex);
let store = new vuex.Store({
    state:{
        userInfo:{},
        areaList:[],     //区域下拉列表
        permissionKeyList: [], // 权限KEY列表
        permissionList: [], // 权限列表(元数据)
        unitValue:{},   // 单位部门选择 列表
        treeData:[],    // 树状图默认省，市，区，医院，科室...
        leftTreeData:[],    // 用户管路 left-tree组件中的数数据。。。。。。。。。。。
        checkedNodes:{}, //选择的树节点
        rootTree:[],         // 权限树状图
        checkedDepartment: {}, // 选中的科室列表
        checkedParams: {}, // 选中的默认配置数据
        checkedDepartmentUser: {}, // 选中的科室人员列表
        roleTree:[],         // 角色树状图
        defaultParams:{},
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
            state.treeData = list;
            // uni.setStorageSync("treeData123",JSON.stringify(list));
        },
        setLeftTreeData(state,list){
            state.leftTreeData = list;
            uni.setStorageSync("leftTreeData",JSON.stringify(list));
        },
        setCheckedNodes(state,obj){
            state.checkedNodes = obj
        },
        setCheckedDepartment(state, obj) {
            state.checkedDepartment = obj;
        },
        setCheckedParams(state, obj) {
            state.checkedParams = obj;
        },
        setCheckedDepartmentUser(state, obj) {
            state.checkedDepartmentUser = obj;
        },
        setRootTree(state,list){
            // 可持续缓存失败了。 我也不知道为什么
            state.rootTree = list;
            uni.setStorageSync('rootTree',list);
        },
        setRoleTree(state,list){
            // 可持续缓存失败了。 我也不知道为什么
            state.roleTree = list;
            uni.setStorageSync('roleTree',list);
        },
        setUserInfo(state,list){
            state.userInfo = list;
            let {departmentId,departmentIdList,orgType} = list;
            let lastId = departmentIdList[departmentIdList.length-1];
            let params = {};
            if(orgType>2){  // 如果区域ID 为3,4  则医院ID = 登陆信息中的的 departmentId 
                params = {
                    departmentId:lastId,
                    hospitalId:departmentId
                }
            }else{  // 否则区域ID 为 1,2 的时候 医院ID取登陆信息中的departmentIdList数组中的最后一个
                params = {
                    hospitalId:lastId
                }
            }
            state.defaultParams = params;
            uni.setStorageSync("defaultParams",JSON.stringify(params))
            uni.setStorageSync("userInfo",JSON.stringify(list))
        },
    },
    actions:{
        async getAreaList(context){
           let {code,result,message}= await getThreeAreaCascadeList();
            if(code==200){
                this.context.commit('setAreaList',result)
            }
        },
        async getLeftTreeData(context){
            sysDepartmentTreeList().then(({code,result})=>{
                if(code==200){
                    context.commit('setLeftTreeData', result);
                }
            })
        },
        getTreeData(context){
            getMyDepartmentTreeList().then(({code,result})=>{
                if(code==200){
                    context.commit('setTreeData', result);
                }
            })
        },
        getRootTree(context){
            getRootTreeList().then(res=>{
                if(res.code==200){
                    context.commit('setRootTree', res.result);
                }
            }) 
        },
        getRoleTree(context){
            getRootTreeList().then(res=>{
                if(res.code==200){
                    context.commit('setRoleTree', res.result);
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
        }
    },
    getters: {
        // nodesChecked: state => {
        //     let checkedNodes = state.checkedNodes;
        //     store.commit('setCheckedNodes', {});
        //     return checkedNodes;
        // },
    },
    modules: {
        plugins: [
            createPersistedState({
                storage: {
                    getItem: key => uni.getStorageSync(key),
                    setItem: (key, value) => uni.setStorageSync(key, value),
                    removeItem: key => uni.removeStorageSync(key)
                }
            })
        ],
    }
})

export default store