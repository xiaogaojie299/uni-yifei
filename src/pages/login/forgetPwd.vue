<template>
  <view class="container">
    <view class="header flex-ver-center">
      <view class="font-s-32 font-w-600"> 请使用手机号重置 </view>
    </view>
    <!-- 中间主体 -->
    <view class="main">
      <view class="main-content my-box">
        <form @submit="formSubmit">
          <view
            v-for="(item, index) in list"
            :key="index"
            class="list-item h-100 flex-center"
          >
            <img class="mr-10" :src="item.imgUrl" alt="" />
            <input
              class="ipt pl-10"
              :style="index==2?'padding-right:200rpx':''"
              :type="isWatch ? 'text' : item.type"
              :placeholder="item.placeholder"
              v-model="item.value"
              :name="name"
            />
            <!-- 点击显示密码 -->
            <view style="height: 100%; width: 60rpx" @tap="watchPwd">
              <img
                class="eys"
                v-if="index == 3"
                :src="
                  isWatch
                    ? require('@/static/images/iseys.png')
                    : require('@/static/images/uneys.png')
                "
                alt=""
              />
            </view>
            <!-- 获取验证码 -->
            <view v-if="index == 2" class="flex-center" style="height: 100%">
              <!-- disabled 不生效，真恶心 --> 
              <button @tap="getCode" class="get-code" :disabled="isDisable">
                {{ codetitle }}
              </button>
            </view>
          </view>
          <button form-type="submit" class="btn flex-dev-center">重置</button>
        </form>
        <!-- 提交按钮 -->
        <u-toast ref="uToast" />
      </view>
    </view>
  </view>
</template>
<script>
import { getValidateCode, checkValidateCode, resetPassword } from "@/utils/api";
import { validatePhoneNumber } from "@/utils/regular";
export default {
  data() {
    return {
      isWatch: false, //控制密码是否能显示
      list: [
        {
          placeholder: "请输入用户名",
          value: "",
          name: "oldPwd",
          type: "text",
          imgUrl: require("@/static/images/userIcon.png")
        },
        {
          placeholder: "请输入手机号",
          value: "",
          name: "phone",
          type: "number",
          imgUrl: require("@/static/images/mobile.png")
        },
        {
          placeholder: "请输入手机验证码",
          value: "",
          name: "phoneCode",
          type: "number",
          imgUrl: require("@/static/images/code.png")
        },
        {
          placeholder: "新密码",
          value: "",
          name: "newPwd",
          type: "password",
          imgUrl: require("@/static/images/upwd.png")
        },
      ],
      timers: null, //获取验证码定时器
      codetitle: "获取验证码",
      isDisable: false,
    };
  },
  methods: {
    watchPwd() {
      console.log("切换");
      this.isWatch = !this.isWatch;
    },
    async formSubmit(e) {
      console.log("form发生了submit事件，携带数据为：", e.detail);
      let account = this.list[0].value; //用户用户名
      let phone = this.list[1].value; //用户手机号
      let validateCode = this.list[2].value; //用户验证码
      let password = this.list[3].value; //用户新密码
      if (!account) {
        this.$refs.uToast.show({
          title: "用户名不能为空",
        });
        return;
      }
      if (!phone) {
        this.$refs.uToast.show({
          title: "手机号不能为空",
        });
        return;
      }
      if (!validatePhoneNumber(phone)) {
        this.$refs.uToast.show({
          title: "请输入正确的手机格式",
        });
        return;
      }
      if (!validateCode) {
        this.$refs.uToast.show({
          title: "验证码不能为空",
        });
        return;
      }
      if (!password) {
        this.$refs.uToast.show({
          title: "请输入新密码",
        });
        return;
      }
      try {
        // 校验验证码是否匹配
        let codeParams = {
          //校验码参数
          account,
          phone,
          validateCode,
        };
        // 重置密码参数
        let params = {
          account,
          phone,
          validateCode,
          password,
        };
        let { code, message } = await checkValidateCode(codeParams);
        console.log("code=",code,"message",message);
        if (code == 200) {  //判断校验码是否跟后端匹配
          let result = await resetPassword(params);
          if (result.code == 200) {
            this.$refs.uToast.show({
              title: "重置密码成功",
            });
            uni.navigateTo({
              path: "./index.vue",
            });
          } else {
            this.$refs.uToast.show({
              title: result.message,
            });
          }
        } else {
          this.$refs.uToast.show({
            title: message,
          });
          return;
        }
      } catch (e) {
        console.log(e);
      }
    },
    getCode() {
      //点击获取验证码
      let account = this.list[0].value;
      let phone = this.list[1].value;
      if (!account) {
        this.$refs.uToast.show({
          title: "请输入用户名",
        });
        return;
      }
      if (!phone) {
        this.$refs.uToast.show({
          title: "请输入手机号",
        });
        return;
      }
      if (!validatePhoneNumber(phone)) {
        this.$refs.uToast.show({
          title: "请输入正确的手机格式",
        });
        return;
      }
      let params = { account, phone };
      this.startTime(params);
    },
    async startTime(params) {
      // 调用发送验证码请求
      let res = await getValidateCode(params);
      if (res.code == 200) {
        try {
          this.$refs.uToast.show({
            title: "发送验证码成功",
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$refs.uToast.show({
          title: res.message,
        });
      }
      this.isDisable = true; //是否禁用按钮
      let i = 10; //定时器时间数
      // 启动定时器
      this.timers = setInterval(() => {
        i--;
        if (i == 0) {
          this.isDisable = false;
          clearInterval(this.timers);
          i = 9;
          this.codetitle = "获取验证码";
        } else {
          this.codetitle = `${i}秒后重新获取`;
          this.isDisable = true;
        }
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 72rpx;
  background: rgba(21, 57, 175, 0.08);
  color: $my-main-color;
  font-family: PingFangSC-Semibold, PingFang SC;
}
.main {
  .main-content {
    .list-item {
      border-bottom: 2px solid #eaeaea;
      position: relative;
      img {
        width: 40rpx;
        height: 42rpx;
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
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        padding-right: 44rpx;
      }
      .get-code {
        position: absolute;
top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 200rpx;
        height: 66rpx;
        background: #ffffff;
        border-radius: 30rpx;
        border: 2px solid $my-main-color;
        color: $my-main-color;
        font-size: 24rpx;
      }
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
}
</style>