<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header flex-ver-center">
      <view class="header-cont">
        <!-- 头部log -->
        <img class="log" src="" alt="" />
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
              :name="name"
            />
            <view style="height: 100%; width: 60rpx">
              <!-- <img class="eys" v-if="index==1" :src="isWatch?require('@/static/images/iseys.png'):require('@/static/images/uneys.png')" alt="" /> -->
            </view>
          </view>
          <!-- <button form-type="submit" class="btn flex-dev-center">确定</button> -->
        </form>
        <view @tap="goforgetPwd" class="forPwd"> 忘记密码 </view>
        <!-- 提交按钮 -->
        <button @tap="submit" class="btn flex-dev-center">登录</button>
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
      console.log(res);
      if (res.code == 200) {
        try {
          let result = res.result;
          console.log("result=====>",result);
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
        this.$refs.uToast.show({
          title: res.message,
        });
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
        height: 38rpx;
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
      }
    }
  }
  .forPwd {
    width: 100%;
    height: 102rpx;
    text-align: right;
    line-height: 102rpx;
  }
  .btn {
    width: 396rpx;
    height: 80rpx;
    background: $my-main-color;
    border-radius: 40rpx;
    font-size: 28rpx;
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