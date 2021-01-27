<template>
  <view class="container">
    <view class="header flex-ver-center">
      <view class="header-content">
        <!-- 二维码图片 -->
        <view class="QRcode">
          <!-- <vue-qr
              :size="191"
              :margin="0"
              :auto-color="true"
              :dot-scale="1"
              :text="userInfo.qrUrl" /> -->
          <view v-if="userInfo.orgType== 4">
              <vue-qr
              :size="191"
              :margin="0"
              :auto-color="true"
              :dot-scale="1"
              :text="userInfo.qrUrl" />
          </view>
          <view v-else>
            <img src="@/static/images/logo.png" alt="">
          </view>
          
        </view>
        <!-- 姓名 -->
        <view class="name fon-s-36 mb-20 mt-20">{{userInfo.name}}</view>
        <!-- 绑定医院 -->
        <view class="hospital font-s-28">{{userInfo.departmentName}}</view>
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
import baseURL from "@/utils/BASE_URL"
import vueQr from "vue-qr"
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
          url:"login/index"
        },
      ],
    };
  },
  computed:{
    userInfo(){
      console.log(this.$store.state);
      return JSON.parse(uni.getStorageSync("userInfo")); 
    }
  },
  components:{
    vueQr
  },
  created(){
  },
  methods:{
      goUrl(url){
          console.log("url=",url);
          if(url.includes("login")){
            //http://47.108.162.242:8080/
            // // http://47.108.162.242:8081/index.html#/
            window.location.replace("http://192.168.0.36:8082/");
            // window.location.replace("http://47.108.162.242:8081/index.html#/pages/home/index");
            // uni.clearStorageSync("userInfo");
            uni.setStorageSync("userInfo",{})
            // window.history.replaceState({}, null, 'http://192.168.0.36:8082/#/pages/login/index');
            // uni.redirectTo({
            //   url:"../login/index"
            // })
          }else{
            uni.navigateTo({
              url:"./"+url
          })
          }
          
      },
      test(){
        uni.navigateTo({
          url:"/page-isystem/isystem/depart"
        })
      }
  }
};
</script>
<style lang="scss" scoped>
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
      // background: #d8d8d8;
      background: #fff;
      box-shadow: 0px 4rpx 12rpx 0px rgba(0, 0, 0, 0.16);
      border-radius: 20rpx;
      padding: 18rpx;
      img {
        width: 100%;
        height: 100%;
        // border: 1rpx solid red;
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