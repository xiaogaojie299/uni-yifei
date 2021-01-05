<template lang="">
    <view class="container">
        <view class="main my-box" v-for="(item,index) in list" :key="index">
            <view class="label"> {{item.title}} </view>
                <input
                @tap="handleHospitalShow(index)" 
                :style="{paddingRight:index==0&&'22rpx'}" 
                :type="item.type"
                :disabled="index==0||false"
                v-model = item.value 
                 />
                <img v-if="item.isIcon" src="@/static/images/path.png" />        
        </view>
        <!-- 选择按钮 -->
        <view v-if="isSubmit" class="footer-btn flex-ver-center">
            完 成
        </view>
        <view v-else @tap="submit" class="footer-btn flex-ver-center allow" :class="{allow:!isSubmit}">
            完 成
        </view>
        <!-- 选择医院名称 -->
        <area-drop-down ref="childMethod" :list="areaList" @selectRow="selectRow"></area-drop-down>
        <u-toast ref="uToast" />
    </view>
    

</template>
<script>
import areaDropDown from "@/compontens/my-drop-down/area-drop-down";
import { addMonitor } from "@/utils/api";
export default {
  data() {
    return {
      list: [
        {
          title: "选择医院",
          isIcon: true,
          type: "",
          value: "",
          placeholder:"选择医院"
        },
        {
          title: "设备名称",
          value: "",
          placeholder:"输入设备名称"
        },
        {
          title: "设备监控编号",
          value: "",
          placeholder:"输入设备监控编号"
        },
        {
          title: "自动关闭时间(分钟)",
          type: "umber",
          value: "",
        },
        {
          title: "通道数",
          type: "number",
          value: "",
        },
      ],
      areaList: {}, //医院列表
      selectHos: {}, //选择的医院
      isSubmit:true
    };
  },
  components: {
    areaDropDown,
  },
  watch:{
      "list":{
          handler(newValue, oldValue) {
              this.isSubmit=newValue.some(item=>{
                return !item.value
                })
                console.log("this.isSubmit==>",this.isSubmit);
    　　　　},
    　　　　deep: true
      }
    /*  
      list(val){
          console.log(val);
          this.isSubmit=val.some(item=>{
              return !item.value
          })
       console.log("this.isSubmit==>",this.isSubmit);
      },
      deep:true
      */
  },
  computed:{
      
  },
  created() {
    this.areaList = JSON.parse(uni.getStorageSync("hospital"));
  },
  onLoad(option) {
    /* 
        uni.setNavigationBarTitle({
            title: '新的标题'
        });
    */
  },
  methods: {
    handleHospitalShow(index) {
      if (index == 0) {
        this.childMethod = true;
        this.$refs.childMethod.openShow();
      }
    },
    selectRow(row) {
      //选择医院点击确定
      this.selectHos = row;
      this.list[0].value = row.label;
      console.log(this.selectHos);
    },
    async submit() {
      let params = {};
      this.list.forEach((item, index) => {
        switch (item.title) {
          case "设备名称":
            console.log("执行成功");
            params.deviceName = item.value;
            break;
          case "设备监控编号":
            params.devIdno = item.value;
            break;
          case "自动关闭时间(分钟)":
            params.autoCloseSecond = item.value;
            break;
          case "通道数":
            params.channelNum = item.value;
            break;
        }
      });
      params.hospitalId = this.selectHos.value;
      console.log(params);
      let { code, result, message } = await addMonitor(params);
      if (code == 200) {
        this.$refs.uToast.show({
          title: "添加设备成功",
          type: "success",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({
          title: message,
          icon: "none",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.allow{
    // background: $my-main-color;
    background: $my-main-color !important;
}
.container {
  .main {
    height: 100rpx;
    border-bottom: 1px solid #eaeaea;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .label {
      max-width: 300rpx;
    }
    input {
      text-align: right;
      width: 460rpx;
      height: 100%;
    }
    img {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      width: 16rpx;
      height: 28rpx;
    }
  }
  .footer-btn {
    bottom: 0;
    position: fixed;
    width: 100vw;
    height: 100rpx;
    background: #b2b2b2;
    font-size: 32rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>