<template lang="">
    <view class="container">
        <view class="header">
            <view class="header-cont my-box">
                <!-- 顶部input -->
                <view class="ipt-box">
                    <!-- icon -->
                    <img src="@/static/images/search.png" alt="" />
                    <!-- input框 -->
                    <input @confirm="search()" confirm-type="search" type="text" v-model="sn" placeholder="请输入关键字搜索特征码" />
                </view>
            </view>
        </view>
        <!-- 中间卡片 -->
        <view class="main">
            <view class="list" v-for="(item,index) in list" :key="index">
                <view class="list-item my-box">
                    <view class="content flex">
                        <view class="label font-w-400">医院名称：</view>
                        <view class="label font-w-600">{{item.departmentName}}</view>
                    </view>
                </view>
                
                <view class="list-item my-box">
                    <view class="content flex">
                        <view class="label font-w-400">用户名：</view>
                        <view class="label font-w-600">{{item.account}}</view>
                    </view>
                </view>

                <view class="list-item my-box">
                    <view class="content flex">
                        <view class="label font-w-400">姓名：</view>
                        <view class="label font-w-600">{{item.userName}}</view>
                    </view>
                </view>

                <view class="list-item my-box">
                    <view class="content flex">
                        <view class="label font-w-400">设备特征号：</view>
                        <view class="label font-w-600">{{item.sn}}</view>
                    </view>
                </view>

                <view class="list-item my-box">
                    <view class="content flex">
                        <view class="label font-w-400">登录时间：</view>
                        <view class="label font-w-600">{{item.createTime}}</view>
                    </view>
                </view>

            </view>
        </view>
    </view>
</template>
<script>
import {systemLoginList} from "@/utils/api"
export default {
    data(){
        return {
            sn:"",
            pageNo:1,
            list:[],
            isRemake:true
        }
    },
    onShow(){
        this.getList();
    },
    onReachBottom : function(){ //上拉触底加载更多
        this.pageNo++;
        this.isRemake = false;
        this.getList();
    },
    methods:{
        search(){
            this.isRemake = true;
            this.pageNo=1;
            this.getList()
        },
        async getList(){
            try{
                let params = {
                    sn:this.sn,
                    pageNo:this.pageNo,
                    pageSize:10
                }
                this.sn || delete params.sn
                let {code,result,message} = await systemLoginList(params);
                if(code == 200){
                    if(this.isRemake){
                        this.list = result.records;
                    }else{
                        this.list =this.list.concat(result.records);
                    }
                }
            }catch(e){
                console.log(e);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.label{
    font-size: 28rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    color:rgba(0, 0, 0, 0.8);
}
    .container{
        min-height: 100vh;
        background: RGBA(243, 245, 247, 1);
        .header{
            width: 100%;
            // height: 180rpx;
            height: 108rpx;
            background: $my-main-color;
            .header-cont{
                .ipt-box{
                    position: relative;
                    input{
                        height: 72rpx;
                        width: 100%;
                        height: 100%;
                        border-radius: 36rpx;
                        padding:16rpx 16rpx 16rpx 84rpx;
                        background:#fff;
                    }
                    img{
                        position: absolute;
                        left:40rpx;
                        top:50%;
                        transform: translateY(-50%);
                        width: 32rpx;
                        height: 32rpx;
                    }
                }
            }
        }
        .main{
            .list{
                background: #FFFFFF;
                padding:26rpx 0;
                margin-bottom:20rpx;
                .list-item{
                    .content:nth-of-type(2n){
                        margin:10rpx 0;
                    }
                    .content{
                        view:nth-of-type(1){

                        }
                    }
                }
            }
        }
    }
</style>