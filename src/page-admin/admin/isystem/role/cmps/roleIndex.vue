<template lang="">
    <view class="container">
        <view class="header">
            <view class="header-cont my-box">
                <!-- 顶部input -->
                <view class="ipt-box">
                    <!-- icon -->
                    <img src="@/static/images/search.png" alt="" />
                    <!-- input框 -->
                    <input @confirm="search()" confirm-type="search" type="text" v-model="name" placeholder="请输入关键字搜索" />
                </view>
            </view>
        </view>
        <!-- 中间卡片 -->
        <view class="main">
            <view v-for="(it,i) in roleList" :key="i" class="main-card">
                <view class="my-box">
                <view class="title">角色名称：{{it.roleName}}</view>
                <view class="btn-group">
                    <u-button :hair-line="false">logo设置</u-button>
                    <u-button :hair-line="false">权限配置</u-button>
                    <u-button :hair-line="false" @click="edit(it)">编辑</u-button>
                    <u-button :hair-line="false">删除</u-button>
                </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import {sysRoleList} from "@/utils/api.js"
export default {
    data(){
        return {
            roleList:[],
            name:"", // 输入框搜索的值
        }
    },
    props:{
        type:{ // 1.运营角色  2.用户角色
            type:Number|String,
            default:1
        }
    },
    created(){
        this.getRoleList();
    },
    onLoad(){
    },
    onShow(){
    },
    methods:{
        search(){   // input搜索
            this.getRoleList()
        },
        //  获取权限列表
        getRoleList(){
            let params = {
                keyword:this.name,
                type:this.type
            };
            // 调用接口获取数据
            sysRoleList(params).then(({result,code})=>{
                if(code==200){
                    this.roleList = result;
                }
            })
        },
        edit(roleInfo){   // 编辑
            uni.navigateTo({
                url:"/page-admin/admin/isystem/role/edit"+"?roleInfo="+JSON.stringify(roleInfo)
            })
        }   
    }
}
</script>
<style lang="scss" scoped>
/deep/ .u-btn{
    width: 160rpx;
    height: 56rpx;
    background: #FFFFFF;
    border-radius: 30px;
    opacity: 0.2;
    border: 1px solid #000000;
    font-size: 24rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #000000;
}
.container{
    min-height: 100vh;
    background: #F3F5F7;
}
    .header{
            width: 100%;
            height: 120rpx;
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
            .checkDrop-box{
                height: 100rpx;
                width:100%;
                .checkDrop{
                // width: 460rpx;
                position: relative;
                width:100%;
                height: 44rpx;
                background: RGBA(91, 116, 199, 1);
                border-radius: 22rpx;
                color: #FFFFFF;
                .select-title-box{
                    height: 44rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                img{
                    width: 16rpx;
                    height: 9rpx;
                    margin-left:16px
                }
            }
            }
            
        }
    .main{
        .main-card{
            height: 160rpx;
            background: #FFFFFF;
            margin-bottom: 20rpx;
            .title{
                padding-top:20rpx;
                height: 44rpx;
                display: flex;
                align-items: center;
                font-size: 32rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #000000;
                line-height: 44rpx;
            }
            .btn-group{
                height: 116rpx;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
        }
    }
</style>