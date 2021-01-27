<template lang="">
    <view class="">
        <view class="header">
            <view class="header-cont my-box">
                <!-- 顶部input -->
                <view class="ipt-box">
                    <!-- icon -->
                    <img :src="require('@/static/images/search.png')" alt="" />
                    <!-- input框 -->
                     <slot name="ipt"></slot>
                    <!-- <input @confirm="search()" confirm-type="search" type="text" v-model="name" placeholder="请输入医院完整名称搜索" /> -->
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
    .header{
                width: 100%;
                // height: 180rpx;
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
</style>