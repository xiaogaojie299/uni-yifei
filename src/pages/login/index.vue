<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header flex-ver-center">
      <view class="header-cont">
        <!-- 头部log -->
        <img class="log" src="@/static/images/logo.png" alt="" />
        <view class="title"> 医疗废物信息化管理平台 </view>
      </view>
    </view>
    <!-- 中间主题 -->
    <view class="main">
      <view class="main-content my-box">
        <form>
          <view
            v-for="(item, index) in list"
            :key="index"
            class="list-item h-100 flex-center"
          >
            <img :src="item.imgUrl" alt="" />
            <input
              class="ml-10 ipt pl-10"
              :type="item.type"
              :placeholder="item.placeholder"
              v-model="item.value"
            />

            <view style="height: 100%; width: 60rpx">
              <!-- <img class="eys" v-if="index==1" :src="isWatch?require('@/static/images/iseys.png'):require('@/static/images/uneys.png')" alt="" /> -->
            </view>
          </view>
          <!-- <button form-type="submit" class="btn flex-dev-center">确定</button> -->
        </form>
        <view @tap="goforgetPwd" class="forPwd"> <text @tap="goforgetPwd"> 忘记密码 </text></view>
        <!-- 提交按钮 -->
        <view class="login-btn">
          <button @tap="submit" class="btn flex-dev-center">登录</button>
        </view>
        <u-toast ref="uToast" />
      </view>
    </view>
    <!-- 底部 -->
    <view class="footer flex-ver-center">
      <!-- 微信icon -->
      <img src="@/static/images/wechat.png" alt="" />
    </view>
  </view>
</template>
<script>
import { login, getMenu, } from "@/utils/api.js";
export default {
  data() {
    return {
      // 17708110425 超级管理员
      // 15892310721  医院管理员
      list: [
        {
          placeholder: "请输入用户名",
          value: "17708110425",
          name: "oldPwd",
          type: "text",
          imgUrl: require("@/static/images/userIcon.png")
        },
        {
          placeholder: "请输入密码",
          value: "17708110425",
          name: "newPwd",
          type: "password",
          imgUrl: require("@/static/images/upwd.png")
        },
      ],
    };
  },
  async onLoad(option) {
    let res = await getMenu();
    this.$store.dispatch("getTreeData")
    console.log("res", res);
  },
  methods: {
    async submit() {
      //提交表单
      let uName = this.list[0].value;
      let uPwd = this.list[1].value;
      if (!uName) {
        this.$refs.uToast.show({
          title: "用户名不能为空",
        });
        return;
      }
      if (!uPwd) {
        this.$refs.uToast.show({
          title: "用户密码不能为空",
        });
        return;
      }
      let params = {
        account: uName,
        password: uPwd,
      };
      let res = await login(params);
      if (res.code == 200) {
        try {
          let result = res.result;
          uni.setStorageSync("token",result.token)
          uni.setStorageSync("userInfo", JSON.stringify(result));
          // 在这里捞一次用户权限数据，存入Storage和Vuex
          this.$store.dispatch('setPermissionList');
          this.$refs.uToast.show({
            title:"登陆成功",
            type: 'success',
          })
          setTimeout(()=>{
            uni.switchTab({
              url:"../home/index"
            })
          },1500)
        } catch (e) {
          console.log(e);
        }
      } else {
        // this.$refs.uToast.show({
        //   title: res.message,
        // });
      }
      // uni.switchTab({url:"../home/index"})
    },
    goforgetPwd() {
      //跳转忘记密码页面
      uni.navigateTo({
        url: "./forgetPwd",
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.header {
  background: $my-main-color;
  height: 338rpx;
  width: 100%;
  .header-cont {
    display: flex;
    flex-direction: column;
    align-items: center;
    .log {
      width: 140rpx;
      height: 140rpx;
      background: #ffffff;
      border-radius: 50%;
    }
    .title {
      height: 56rpx;
      font-size: 40rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 56rpx;
    }
  }
}
.main {
  margin-bottom: 302rpx;
  .main-content {
    .list-item {
      border-bottom: 2px solid #eaeaea;
      position: relative;
      img {
        width: 40rpx;
        height: 44rpx;
      }
      .eys {
        width: 40rpx;
        height: 30rpx;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
      .ipt {
        width: 100%;
        height: 100%;
        padding-right: 44rpx;
        font-size:30rpx;
        border: 1px solid red;
        border: none;
        outline: none;
      }
    }
  }
  .forPwd {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    text{
      display: inline-block;
      line-height: 102rpx;
    }
  }
  .login-btn{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn {
    width: 396rpx;
    height: 90rpx;
    background: $my-main-color;
    border-radius: 40rpx;
    font-size: 38rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #ffffff;
    margin-top: 22rpx;
  }
}
.footer {
  img {
    width: 88rpx;
    height: 88rpx;
  }
}
</style>