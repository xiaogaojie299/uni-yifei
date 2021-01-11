<template lang="">
    <view class="container">
        <view class="header my-box h-100">
            <view class="label flex-center">父级组织</view>
            <input @tap="openTree" class="pr-30" type="text" placeholder="请选择你的父级组织" disabled :value="node.parent.label" />
            <img src="@/static/images/path.png" />
            
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">组织名称</view>
            <input type="text" placeholder="请输入你的组织名称" value="" />
            
        </view>
        <view class="header my-box h-100">
            <view class="label flex-center">组织类型</view>
            <input class="pr-30" type="text" placeholder="请选择你的组织类型" disabled value="" />
            <img src="@/static/images/path.png" />
            
        </view>
        
        <leftree ref="handleModel" />
    </view>
</template>
<script>
import mixins from "@/mixins/mx-tree"
import {getParent} from "@/utils/api"
import leftree from "./cmps/left-tree"

export default {
    mixins:[mixins],
    data(){
        return {
            node:{},
            listRegion:[]           // 上个页面获取的数据
        }
    },
    provide() {
    return {
      _this: this,
    };
  },
    components:{
        leftree,
    },
    methods:{
        openTree(){
            console.log("打开树");
            this.$refs.handleModel.openModel()
        }
    },
    onLoad(options){
        let node = JSON.parse(options.node);
        this.node =node
        console.log(this.node);
        let params = {
            id: node.parentId
        }
        getParent(params).then(res=>{
            console.log(params);
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
        }
        
</style>