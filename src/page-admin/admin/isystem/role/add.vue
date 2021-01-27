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
       <!-- :default-value="roleIndex" -->
        <s-select mode="mutil-column-auto" title="角色" v-model="roleShow" label-name="roleName" :default-value="roleIndex" value-name="id" :list="roleSelList" @confirm="roleBack"></s-select>
        <u-toast ref="uToast" />
    </view>
    

</template>
<script>
import areaDropDown from "@/compontens/my-drop-down/area-drop-down";
import { addMonitor,editMonitor,addBatch,editSysRole,addRole } from "@/utils/api";
import sSelect from '@/compontens/s-select';
import mixins from "./role-mx"
export default {
    mixins:[mixins],
  data() {
    return {
      roleInfo:{},  // 角色列表
      roleShow:false,   // 控制picker 
      roleIndex:[0],
      roleName:"",  // 角色分组
      roleId:"",
      selRoleType:"",
      roleSelList:[ {
          roleName:"运营角色",
          id:1
        },
        {
          roleName:"用户角色",
          id:2
        }],
      list: [
        {
          title: "角色分组",
          isIcon: true,
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
    },
  methods: {
      handleRoleShow(index){
          if(index==0){
              this.roleShow = true
          };
      },
      roleBack(obj){  // 选择角色传过来的值
            this.roleSelList.forEach((item,index)=>{
                if(item.id == obj[0].value){
                    this.roleIndex = [index];
                }
            })
            this.roleInfo.type = obj[0].value;
            this.list[0].value= obj[0].label;
            this.list[0].roleName= obj[0].value;
     },
     submit(){
         let params = this.roleInfo;
         params.roleName = this.list[1].value;
        console.log("params==>",params);
         addRole(params).then(({result,code})=>{
             if(code == 200){
                this.$refs.uToast.show({
					title: '添加成功',
					type: 'success',
                })
             setTimeout(()=>{
                 uni.navigateBack()
             },1500)
             }
        })
     }
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