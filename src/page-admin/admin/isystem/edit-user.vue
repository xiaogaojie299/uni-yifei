<template lang="">
    <view class="container">
        <view class="header my-box h-100">
            <view class="label flex-center">所属组织</view>
            <input @tap="openTree" class="pr-30" type="text" placeholder="请选择你的所属组织" disabled :value="form.area" />
            <img src="@/static/images/path.png" />
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">姓名</view>
            <input type="text" v-model="form.name" placeholder="请输入你的姓名" value="" />
            
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">用户名</view>
            <input type="text" v-model="form.account" placeholder="请输入你的用户名" value="" />
            
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">手机号码</view>
            <input type="number" v-model="form.phone" placeholder="请输入你的手机号码" value="" />
            
        </view>
       <view class="header my-box h-100">
            <view class="label flex-center">角色</view>
            <input @tap="handleRoleShow" class="pr-30" type="text" placeholder="请选择你的组织类型" disabled :value="form.roleName" />
            <img src="@/static/images/path.png" />
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">密码</view>
            <input type="password" v-model="form.password" placeholder="请输入你的密码" value="" />
            
        </view>
        
        <!-- 选择按钮 -->
        <view v-if="!isSubmit" class="footer-btn flex-ver-center">
            保 存
        </view>
        <view v-else @tap="submit" class="footer-btn flex-ver-center allow">
            保 存
        </view>
        <!-- <view @tap="submit" class="footer-btn flex-ver-center allow">
            保 存
        </view>  -->
        <leftree :expandKeys="form.departmentId" :checkedKeys="form.checkedKeys" @checkoutValue="checkoutValue" ref="handleModel" />
         <!-- 角色弹框 --> 
        <s-select mode="mutil-column-auto" title="角色" v-model="roleShow" label-name="roleName" value-name="id" :default-value="roleIndex" :list="roleList" @confirm="roleBack"></s-select>
    </view>
</template>
<script>
 import {getParent,sysDepartmentEdit,getMyDepartmentTreeList,userEdit} from "@/utils/api"
 import sSelect from '@/compontens/s-select';
 import leftree from "./cmps/left-tree"
 import {actions} from "vuex"
 export default {
    data(){
        return {
            form:{
                departmentLabel:"",     // 选择组织
                departmentId:"",   // 选择组织ID
                name:"",       // 用户姓名
                account:"",       // 用户名
                phone:"",        // 手机号码
                roleId:"",        
                roleName:"",
                password:""          // 用户密码    
            },
            parent:{
                label:"",
                id:null
            },
            name:"",    //组织名称
            listRegion:[],           // 上个页面获取的树数据
            node:null,            // 父组件传过来的值
            roleShow:false,          // 角色选择框的显示与隐藏
            roleList:[],
            roleIndex:[0]                 // 默认选择的角色值
        }
    },
    provide() {
        return {
        };
  },
    components:{
        leftree,sSelect
    },
    watch:{
        "form":{
            handler(newValue,oldValue){
                console.log(newValue);
            },
            deep:true
        }
    },
    created(){
        this.roleList = uni.getStorageSync("roleList");
        console.log(this.roleList);
    },
    computed:{
            // isSubmit(){
            //     for (var k in this.form &&this.form.departmentId){
            //         if(!this.form[k]){
            //             return false
            //         }else{
            //             return true
            //         }
            //     }
            // },
        isSubmit(){
            let {account,phone} = this.form;
            return account && phone
        },
        orgType(){
            console.log(this.$store.state);
            if(this.$store.state.unitValue){
                // return  JSON.parse(uni.getStorageSync("unitValue"));
                return this.$store.state.unitValue
            }else{
                return {}
            }
        },
    },
    methods:{
        roleBack(obj){  // 选择角色传过来的值
            this.roleList.forEach((item,index)=>{
                console.log(item.id);
                if(item.id == obj[0].value){
                    console.log(item.id);
                    this.roleIndex = [index];
                }
            })
            this.form.roleName= obj[0].label;
            this.form.roleIdList= [obj[0].value];
            console.log(this.form);
        },
        openTree(){
            this.$refs.handleModel.openModel(this.form);
        },
        handleRoleShow(){   // 弹出角色选择框
            this.roleShow = true;
        },
        checkoutValue(node){
            console.log(node);
            this.form.area = node.data.label;
            this.form.value = node.data.value;
            // this.form.area = 
        },
        goOrgType(){    //跳转到组织类型
            try{
               if(!this.node.orgType){
                    uni.navigateTo({
                        url:"./org-type"+"?orgType="+this.node.orgType
                })
               }else{
                   uni.showToast({
                       title:"请先选择你的的父级组织"
                   })
               }
            }catch(e){
                //TODO handle the exception
                console.log(e);
                uni.showToast({
                       title:"请先选择父级组织",
                       icon:"none"
                   })
            }
           
        },
        submit(){
            try{
            console.log("this.form==>",this.form);
            let params = this.form;
            delete params.childrenList;
            params.parentId = this.parent.id;
            params.departName = this.name;
            userEdit(params).then(res=>{
                if(res.code==200){
                    uni.showToast({
                        title:"编辑成功",
                        icon:"none"
                    })
                    setTimeout(()=>{
                         uni.navigateTo({
                        url:"./user"
                    })
                    },1500)
                   
                }
            })
            }catch(e){
                console.log(e);
            }
            
        }
    },
    onLoad(options){
        this.form = JSON.parse(options.form);
        // for (var k in this.form){
        //     if(k == "roleIdSet"){
        //         console.log(k);
        //         k = "roleIdList"
        //     }
        // }
        this.form.roleIdList = this.form['roleIdSet'] 
        delete this.form.roleIdSet
        console.log("this.form==",this.form);
        /* 
            canDelete: true
            departName: "测试123"
            id: 17947
            isWarehouse: 0
            key: 17947
            level: 118
            orgType: 2
            parentId: 40
            treeCode: "0000170002"
        this.name = node.label;
        switch( node.data.orgType){
            case 1:
            this.orgType = "区域";
            break 
            case 2:
            this.orgType = "单位";
            break;
            case 3:
            this.orgType = "部门";
            break;
            default: 
            this.orgType = "科室";
        }
        let params = {
            id: node.parentId
        }
        getParent(params).then(res=>{
        })
        */

    }
}
</script>
<style lang="scss" scoped>
        .container{
            .header{
                display: flex;
                position: relative;
                justify-content: space-between;
                border-bottom: 1px solid #EAEAEA;
                .label{
                    font-size: 32rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #000000;
                }
                input{
                    height: 100%;
                    width: 400rpx;
                    text-align: right;
                }
                img{
                    width: 16rpx;
                    height: 28rpx;
                    position: absolute;
                    right:0;
                    top:50%;
                    transform: translateY(-50%);
                }
            }
            .footer-btn {
                    bottom: 0;
                    position: fixed;
                    width: 100vw;
                    height: 100rpx;
                    background: #b2b2b2;
                    font-size: 32rpx;
                    font-family: PingFang-SC-Medium, PingFang-SC;
                    font-weight: 500;
                    color: #ffffff;
                }
                .allow{
                // background: $my-main-color;
                background: $my-main-color !important;
                }
        }
        
</style>