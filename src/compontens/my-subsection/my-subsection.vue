<template>
    <view class="">
        <u-subsection @change="changeMenu" active-color="#1539AF" inactive-color="#ffffff" :list="list"></u-subsection>
    </view>
</template>
<script>
export default {
    data(){
        return {
            
        }
    },
    props:{
        list:{
            type:Array
        }
    },
    methods:{
        changeMenu(value){
            this.$emit("changeMenu",value)
        }
    }
}
</script>
<style lang="scss" scoped>
    /deep/ .u-subsection{
        height: 56rpx !important;
        background: #5B74C7 !important;
        border-radius: 28rpx !important;
    }
    /deep/ .u-item-text{
        font-size: 28rpx;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
    }
    /deep/ .u-item-bg{
        width: 226rpx !important;
    height: 44rpx !important;
    background: #FFFFFF !important;
    border-radius: 22rpx !important;
}
</style>