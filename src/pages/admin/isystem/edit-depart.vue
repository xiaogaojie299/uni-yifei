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
            <input class="pr-30" type="text" placeholder="请选择你的组织类型" disabled :value="orgType" />
            <img src="@/static/images/path.png" />
        </view>
        <!-- 选择按钮 -->
        <view v-if="!isSubmit" class="footer-btn flex-ver-center">
            保 存
        </view>
        <view v-else @tap="submit" class="footer-btn flex-ver-center allow">
            保 存
        </view>
        <leftree @checkoutValue="checkoutValue" ref="handleModel" />
    </view>
</template>
<script>
import {getParent,sysDepartmentEdit} from "@/utils/api"
import leftree from "./cmps/left-tree"

export default {
    data(){
        return {
            parent:{
                label:"",
                id:null
            },
            name:"",    //组织名称
            listRegion:[],           // 上个页面获取的树数据
            node:null,            // 父组件传过来的值
            orgType:""
        }
    },
    provide() {
        return {
        };
  },
    components:{
        leftree,
    },
    computed:{
        isSubmit(){
            return this.parent.label && this.name
        }
    },
    methods:{
        openTree(){
            this.$refs.handleModel.openModel()
        },
        checkoutValue(node){
            this.parent.label = node.data.label;
            this.parent.id = node.data.id;
        },
        submit(){
            let params = this.node;
            delete params.childrenList;
            params.parentId = this.parent.id;
            params.departName = this.name;
            console.log("params",params);
            sysDepartmentEdit(params).then(res=>{
                if(res.code==200){
                    uni.showToast({
                        title:"编辑成功",
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
        */
        let node = JSON.parse(options.node);
        this.parent.label = node.parent.label;
        this.parent.id = node.parentId;
        
        this.node = node.data;
        this.name = node.label;
        switch( node.data.orgType){
            case 1:
            this.orgType = "地区";
            break 
            case 2:
            this.orgType = "单位";
            break;
            default: 
            this.orgType = "部门";
        }
        let params = {
            id: node.parentId
        }
        getParent(params).then(res=>{
        })
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