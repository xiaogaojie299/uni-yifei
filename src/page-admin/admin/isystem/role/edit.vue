<template lang="">
    <view class="container">
        <view class="main my-box" @tap="handleRoleShow(index)"  v-for="(item,index) in list" :key="index">
            <view class="label"> <text class="font-w-500">{{item.title}}</text> </view>
                <input
                class="label ipt"
                :style="{paddingRight:index==0&&'22rpx'}" 
                :type="item.type"
                v-model = item.value 
                :disabled="index==0||false"
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
        <!-- <u-select v-model="show" mode="single-column" label-name="name" value-name="id" :list="firmList" @confirm="selectRow"></u-select> -->
       <!-- 角色弹框 -->
        <s-select mode="mutil-column-auto" title="角色" v-model="roleShow" label-name="roleName" value-name="id" :default-value="roleIndex" :list="roleList" @confirm="roleBack"></s-select>
        <u-toast ref="uToast" />
    </view>
    

</template>
<script>
import areaDropDown from "@/compontens/my-drop-down/area-drop-down";
import { addMonitor,editMonitor,addBatch } from "@/utils/api";
import sSelect from '@/compontens/s-select';
export default {
  data() {
    return {
      roleInfo:{},  // 角色列表
      roleShow:false,   // 控制picker 
      roleIndex:[1],
      roleName:"",
      roleId:"",
      roleList:[
        {
          roleName:"运营管理",
          id:1
        },
        {
          roleName:"用户管理",
          id:2
        }
      ],
      list: [
        {
          title: "角色分组",
          isIcon: true,
          type: "",
          value: "",
          placeholder:"请选择厂商"
        },
        {
          title: "角色名称",
          value: "",
          placeholder:"请输特征码"
        },
      ],
      isSubmit:true,
    };
  },
  components: {
    sSelect
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
  },
  computed:{
      
  },
  created() {
  },
  onLoad(option){
      let roleInfo = JSON.parse(option.roleInfo);
        this.roleInfo = roleInfo;
        this.roleIndex = [roleInfo.type];
        console.log("this.roleIndex ",this.roleIndex );
        console.log();
    },
  methods: {
      handleRoleShow(index){
          if(index==0){
              this.roleShow = true
          };
      },
      roleBack(obj){  // 选择角色传过来的值
            this.roleList.forEach((item,index)=>{
                if(item.id == obj[0].value){
                    this.roleIndex = [index];
                }
            })
            this.roleName= obj[0].label;
            this.roleId= obj[0].value;
            console.log(this.roleName,this.roleId);
     },
  }
};
</script>
<style lang="scss" scoped>
.ipt{
        background: #fff;
    height: 100%;
    border: none;
    outline: none;
    text-align: right;
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