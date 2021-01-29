<template lang="">
    <view class="container">
        <view class="main my-box" v-for="(item,index) in list" :key="index">
            <view class="label"> <text class="font-w-500">{{item.title}}</text> </view>
            <view class="" @tap="handleHospitalShow(index)">
              <input
                class="label ipt"
                @tap="handleHospitalShow(index)"
                :style="{paddingRight:index==0&&'22rpx'}" 
                :type="item.type"
                :disabled="type==2&&item.disabled"
                v-model = item.value 
                 />
                <img v-if="item.isIcon" src="@/static/images/path.png" />        
            </view>
                
        </view>
        <!-- 选择按钮 -->
        <view v-if="isSubmit" class="footer-btn flex-ver-center">
            {{btnText}}
        </view>
        <view v-else @tap="submit" class="footer-btn flex-ver-center allow">
            {{btnText}}
        </view>
        <!-- 选择医院名称 -->
        <!-- <area-drop-down ref="childMethod" :defaultValue="defaultValue"></area-drop-down> -->
        <u-select v-model="show" :default-value="defaultValue" mode="mutil-column-auto" :list="areaList" @confirm="selectRow"></u-select>
        <u-toast ref="uToast" />
    </view>
    

</template>
<script>
import areaDropDown from "@/compontens/my-drop-down/area-drop-down";
import { addMonitor,editMonitor } from "@/utils/api";
export default {
  data() {
    return {
      list: [
        {
          title: "选择医院",
          isIcon: true,
          type: "",
          value: "",
          disabled:false,
          placeholder:"选择医院"
        },
        {
          title: "设备名称",
          value: "",
          placeholder:"输入设备名称",
          disabled:false
        },
        {
          title: "设备监控编号",
          value: "",
          placeholder:"输入设备监控编号",
          disabled:true,
        },
        {
          title: "自动关闭时间(分钟)",
          type: "number",
          value: "",
          disabled:false
        },
        {
          title: "通道数",
          type: "number",
          value: "",
          disabled:true
        },
      ],
      areaList: [], //医院列表
      selectHos: {}, //选择的医院
      isSubmit:true,
      monitorParams:{},
      defaultValue:[0,0,0,0,0],
      show:false,
      type:1,        //1.编辑  2.新增
      btnText:"",
      selectTree:{} // 选择的医院
    };
  },
  components: {
    areaDropDown,
  },
  watch:{
      "list":{
          handler(newValue, oldValue) {
              console.log(newValue[4].value==="");
              this.isSubmit=newValue.some(item=>{
                return item.value===""
                })
    　　　　},
    　　　　deep: true
      },
      selectTree(val){
          this.list[0].value = val.label;
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
   this.type = option.type;
   console.log("option.type==>",option.type);
    if(option.type==2){
      this.btnText = "提 交"
            uni.setNavigationBarTitle({
                title: '编辑监控设备'
            });
            this.monitorParams = JSON.parse(option.params);
            this.selectTree.label = this.monitorParams.hospitalName;
            this.selectTree.value = this.monitorParams.hospitalId;
            this.list[0].value = this.monitorParams.hospitalName;
            this.list[1].value = this.monitorParams.deviceName;
            this.list[2].value = this.monitorParams.devIdno;
            this.list[3].value = this.monitorParams.autoCloseSecond;
            this.list[4].value = this.monitorParams.channelNum;
            // this.defaultValue =  this.monitorParams.departmentIdList;
    }else{
      this.btnText = "新 增"
        uni.setNavigationBarTitle({
                title: '新增监控设备'
        });
    }
  },
  methods: {
    handleHospitalShow(index) {
      console.log("编辑");
        if (index == 0) {
          let params = this.selectTree;
          params.checkOnlyLeaf = true;
          this.$goTree(params)
          //   this.childMethod = true;
          // this.show = true;
      }
    },
    selectRow(row) {
      //选择医院点击确定
      this.selectHos = row[this.list.length-1];
      console.log();
      this.list[0].value = this.selectHos.label;
      console.log(this.selectHos);
    },
    async submit() {
      let params = {};
      if(this.type==1){
        //   新增监控设备
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
        params.hospitalId = this.selectTree.value;
        var { code, result, message } = await addMonitor(params);
      }else{
        //   编辑监控设备
            this.monitorParams.hospitalName = this.selectTree.label;
            this.monitorParams.hospitalId = this.selectTree.value;
            this.monitorParams.hospitalName=this.list[0].value; 
            this.monitorParams.deviceName =this.list[1].value;
            this.monitorParams.devIdno=this.list[2].value;
            this.monitorParams.autoCloseSecond=this.list[3].value;
            this.monitorParams.channelNum=this.list[4].value;
           var { code, result, message } = await editMonitor(this.monitorParams);
      }
      
      if (code == 200) {
        this.$refs.uToast.show({
          title: this.type==1?"添加设备成功":"编辑设备成功",
          type: "success",
        });
        setTimeout(() => {
          uni.navigateTo({
              url:"/page-admin/admin/monitor/setting"
          });
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
.ipt{
  border:none;
  outline: none;
  background: #fff;
   text-align: right;
      width: 460rpx;
      height: 80rpx;
      font-size: 28rpx;
}
input {
     
    }
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