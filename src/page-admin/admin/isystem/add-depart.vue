<template lang="">
    <view class="container">
        <view class="header my-box h-100">
            <view class="label flex-center">父级组织</view>
            <input @tap="openTree" class="pr-30" type="text" placeholder="请选择你的父级组织" disabled :value="parent.label" />
            <img src="@/static/images/path.png" />
            
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">组织名称</view>
            <input type="text" v-model="name" placeholder="请输入你的组织名称" value="" />
            
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">组织类型</view>
            <input @tap="goOrgType" class="pr-30" type="text" placeholder="请选择你的组织类型" disabled :value="orgType.name" />
            <img src="@/static/images/path.png" />
        </view>
        <view v-if="orgType.value==4" class="header my-box h-100">
            <view class="label flex-center">是否暂存间</view>
            <input @tap="isWarehouse" class="pr-30" type="text" placeholder="是否需要暂存间" disabled :value="wareHouse.label" />
            <img src="@/static/images/path.png" />
        </view>
        <!-- 选择按钮 -->
        <view v-if="!isSubmit" class="footer-btn flex-ver-center">
            提 交
        </view>
        <view v-else @tap="submit" class="footer-btn flex-ver-center allow">
            提 交
        </view>
        <leftree @checkoutValue="checkoutValue" ref="handleModel" />
         <s-select mode="mutil-column-auto" title="选择暂存间" v-model="houseShow" :default-value="houseIndex" :list="houselist" @confirm="roleBack"></s-select>
    </view>
</template>
<script>
import {getParent,sysDepartmentEdit,addDepartment} from "@/utils/api"
import sSelect from '@/compontens/s-select';
import leftree from "./cmps/left-tree"
import {actions} from "vuex"
export default {
    data(){
        return {
            parent:{
                label:"",
                id:null
            },
            houselist:[{label:"是",value:1},{label:"否",value:0}],
            houseIndex:[0],
            houseShow:false,
            name:"",    //组织名称
            listRegion:[],           // 上个页面获取的树数据
            node:null,            // 父组件传过来的值
            wareHouse:{label:"否",value:1}
        }
    },
    provide() {
        return {
        };
  },
    components:{
        leftree,
        sSelect
    },
    computed:{ 
        isSubmit(){
            return this.parent.label && this.name && this.orgType.name
        },
        orgType(){
            console.log(this.$store.state);
            if(this.$store.state.unitValue){
                // return  JSON.parse(uni.getStorageSync("unitValue"));
                return this.$store.state.unitValue
            }else{
                return {}
            }
        }
    },
    methods:{
        openTree(){ 
            this.$refs.handleModel.openModel()
        },
        checkoutValue(node){
            this.node = node.data;
            this.parent.label = node.data.label;
            this.parent.id = node.data.id;
            console.log("node",this.node);
        },
        goOrgType(){    //跳转到组织类型
            try{
            console.log(this.node.orgType);
               if(this.node.id){
                    uni.navigateTo({
                        url:"./org-type"+"?orgType="+this.node.orgType
                        // url:"/page-admin/admin/isystem/org-type"+"?orgType="+this.node.orgType
                    })
               }else{
                   uni.showToast({
                       title:"请先选择你的的父级组织",
                       icon:"none"
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
        isWarehouse(){
            console.log("是否需要暂存间");
            this.houseShow =true
        },
        roleBack(obj){
                this.wareHouse = obj[0]
        },

        submit(){
            let params = {};
            params.parentId = this.parent.id;
            params.departName = this.name;
            params.orgType = this.orgType.value;
            params.orgType==4 && (params.isWarehouse = this.wareHouse.value);
            addDepartment(params).then(res=>{
                if(res.code==200){
                    uni.showToast({
                        title:"提交成功",
                        icon:"none"
                    })
                    setTimeout(()=>{
                         uni.navigateTo({
                        url:"./depart"
                    })
                    },1500)
                   
                }
            })
        }
    },
    watch:{
        
    },
    onLoad(options){
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