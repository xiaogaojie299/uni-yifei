<template lang="">
    <view class="container">
        <view class="main my-box" v-for="(item,index) in list" :key="index">
            <view class="label"> <text class="font-w-500">{{item.title}}</text> </view>
                <input
                class="label"
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
        <view v-else @tap="submit" class="footer-btn flex-ver-center allow">
            完 成
        </view>
        <!-- 选择医院名称 -->
        <!-- <area-drop-down ref="childMethod" :defaultValue="defaultValue"></area-drop-down> -->
        <u-select v-model="show" mode="single-column" label-name="name" value-name="id" :list="firmList" @confirm="selectRow"></u-select>
        <u-toast ref="uToast" />
    </view>
    

</template>
<script>
import areaDropDown from "@/compontens/my-drop-down/area-drop-down";
import { addMonitor,editMonitor,addBatch } from "@/utils/api";
export default {
  data() {
    return {
      list: [
        {
          title: "厂商",
          isIcon: true,
          type: "",
          value: "",
          placeholder:"请选择厂商"
        },
        {
          title: "特征码",
          value: "",
          placeholder:"请输特征码"
        },
      ],
      firmList: [], //医院列表
      show:false,
      selectHos: {}, //选择的医院
      isSubmit:true,
    };
  },
  components: {
    areaDropDown,
  },
  watch:{
      "list":{
          handler(newValue, oldValue) {
              this.isSubmit=newValue.some(item=>{
                return item.value===""
                })
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
        this.firmList = JSON.parse(uni.getStorageSync("firmList"));
  },
  onLoad(option) {
  },
  methods: {
    handleHospitalShow(index) {
        if (index == 0) {
            this.childMethod = true;
          this.show = true;
      }
    },
    selectRow(row){ //选择医院点击确定
            this.selectHos=row[0];
            this.list[0].value = this.selectHos.label;
            console.log(this.selectHos);
        },
    async submit() {
      let params = {};
        //   新增监控设备
         params.sns = this.list[1].value;
         params.deviceAgentId = this.selectHos.value;
        var { code, result, message } = await addBatch(params);
      if (code == 200) {
        this.$refs.uToast.show({
          title: "新增厂商状态码成功",
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
    text{
          font-size:28rpx;
            color: rgba(0, 0, 0, 1);
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