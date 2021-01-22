<template>
  <view class="container">
    <view class="header flex-ver-center">
      <view class="header-content">
        <!-- 二维码图片 -->
        <view class="QRcode">
          <img src="" alt="" />
        </view>
        <!-- 姓名 -->
        <view class="name fon-s-36 mb-20 mt-20">张三</view>
        <!-- 绑定医院 -->
        <view class="hospital font-s-28">成都市第一人民医院</view>
      </view>
    </view>
    <!-- 中间from -->
    <view class="main">
      <view class="main-content pt-40">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="list-item h-100 flex-between"
          @tap="goUrl(item.url)"
        >
          <view class="">
            {{ item.title }}
          </view>
          <img src="@/static/images/path.png" alt="" />
        </view>
        <!-- <u-button @tap="test">测试跳转</u-button> -->
      </view>
    </view>
  </view>
</template>
<script>
var echarts = require("echarts");
export default {
  data() {
    return {
      list: [
        {
          title: "修改密码",
          url:"change-pwd"
        },
        {
          title: "注销账号",
        //   url:"forget-pwd"
        },
      ],
    };
  },
  created(){
    console.log(echarts);
  },
  methods:{
      goUrl(url){
          console.log("url=",url);
          uni.navigateTo({
              url:"./"+url
          })
      },
      test(){
        uni.navigateTo({
          url:"/page-isystem/isystem/depart"
        })
      }
  }
};
</script>
<style lang="scss">
.header {
  height: 660rpx;
  width: 100%;
  background: $my-main-color;
  .header-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .QRcode {
      width: 400rpx;
      height: 400rpx;
      background: #d8d8d8;
      box-shadow: 0px 4rpx 12rpx 0px rgba(0, 0, 0, 0.16);
      border-radius: 20rpx;
      padding: 18rpx;
      img {
        width: 100%;
        height: 100%;
        border: 1rpx solid red;
      }
    }
    .name,
    .hospital {
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
    }
  }
}
.main {
  width: 100%;
  .main-content {
    width: 694rpx;
    margin: 0 auto;
    background: #ffffff;
    .list-item {
      border-bottom: 2px solid #eaeaea;

      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
    }
    img {
      width: 16rpx;
      height: 28rpx;
    }
  }
}
</style>