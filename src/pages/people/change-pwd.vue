<template>
  <view class="container">
    <!-- 内容 -->
    <view class="content my-box">
      <form @submit="formSubmit">
        <view
          v-for="(item, index) in list"
          :key="index"
          class="list-item h-100 flex-center"
        >
          <img src="@/static/images/upwd.png" alt="" />
          <input
            class="ml-10 ipt pl-10"
            :type="index==1&&isWatch?'text':'password'"
            :placeholder="item.placeholder"
             v-model="item.value"
            :name="name"
          />
          <view style="height:100%;width:60rpx;" @tap="watchPwd">
            <img class="eys" v-if="index==1" :src="isWatch?require('@/static/images/iseys.png'):require('@/static/images/uneys.png')" alt="" />
          </view>
        </view>
        <button form-type="submit" class="btn flex-dev-center">确定</button>
      </form>
      <!-- 提交按钮 -->
      <u-toast ref="uToast" />
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
        isWatch:false,
      list: [
        { placeholder: "请输入原密码", value: "",name:"oldPwd",type:"password" },
        {
          placeholder: "新密码(需包含字母和数字)",
          value: "",
          name:"newPwd",
          type:"password"
        },
      ],
    }
  },
  methods: {
        watchPwd(){
           console.log("切换")
          this.isWatch =!this.isWatch;
        },
    formSubmit(e) {
      console.log("form发生了submit事件，携带数据为：",e.detail);
      let oldPwd=this.list[0].value;
      let newPwd=this.list[1].value;
      if(!oldPwd){
          this.$refs.uToast.show({
					title: '原密码不能为空',
                })
                return
      }
      if(!newPwd){
          this.$refs.uToast.show({
					title: '新密码不能为空',
                })
                return
      }
      if(oldPwd!==newPwd){
          this.$refs.uToast.show({
              title:'请确保两次输入的密码相同'
          })
          return
      }
      var formdata = e.detail.value;
    },
  },
};
</script>
<style lang="scss">
.container {
  width: 100%;
  .content {
    .list-item {
      border-bottom: 2px solid #eaeaea;
      position: relative;
      img {
        width: 32rpx;
        height: 36rpx;
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
          padding-right:44rpx;
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
      margin-top:22rpx;
    }
  }
}
</style>