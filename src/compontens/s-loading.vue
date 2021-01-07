<template>
    <view class="s-loading flex-ver-center">
        <u-loading mode="circle" color="#1539AF" />
        <text style="margin: 0 15rpx;font-size: #fdfdfd;">{{ loadingText }}</text>
    </view>
</template>
<script>
export default {
    props: {
        loadingText: {
            type: String,
            default: '正在加载中..'
        }
    },
    data(){
        return {
        }
    },
    mounted() {
    },
    methods: {
    }
};
</script>
<style lang="scss" scoped>
.s-loading {
    height: 60rpx;
    line-height: 60rpx;
}
</style>