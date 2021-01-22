<template lang="">
    <view class="btn-groups">
        <view @tap="selectBtn(index,item.params)" class="btn-item flex-ver-center" :class="{active:index==isActive}" v-for="(item,index) in btns" :key="index">{{item.title}}</view>
    </view>
</template>
<script>
export default {
  props:{
    btns:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
    data(){
        return {
      // btns: [
      //   { title: "今日"},
      //   { title: "月"},
      //   { title: "季度" },
      //   { title: "半年" },
      //   { title: "年"},
      // ],
      isActive: 0, //选中
        }
    },
    methods:{
        selectBtn(index,params) {
          console.log("被点击了");
            this.isActive = index;
            this.$emit('selectBtn',{params,index})
        },
    }
}
</script>
<style lang="scss" scoped>
    .btn-groups {
      position: relative;
      z-index: 100;
      height: 100rpx;
      line-height:120rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn-item {
        width: 94rpx;
        height: 60rpx;
        border-radius: 30rpx;
        opacity: 0.2;
        border: 2rpx solid #000000;
        font-weight: 500;
      }
      .active {
        border: none;
        background: $my-main-color;
        color: #fff;
        font-weight: 600;
        opacity: 1;
      }
    }
</style>