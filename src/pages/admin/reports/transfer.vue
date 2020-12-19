<template>
  <view>
    <view class="header">
      <view class="">
        <u-dropdown>
          <u-dropdown-item
            v-model="value1"
            title="选择区域"
            @change="selectArea"
            :options="options1"
          ></u-dropdown-item>
          <u-dropdown-item
            v-model="value2"
            title="统计方式"
            :options="options2"
          ></u-dropdown-item>
          <u-dropdown-item
            v-model="value2"
            title="选择月份"
            :options="options2"
          ></u-dropdown-item>
        </u-dropdown>
      </view>
    </view>
    <view class="main"> </view>
    <view class="footer"> </view>
  </view>
</template>
<script>
import {getMyHospitalCascadeList,listSelect} from "@/utils/api.js"
export default {
    data(){
        return {
            value1: 1,
				  value2: 2,
				    options1: [],
				options2: [],
        }
    },
    methods:{
      async init(){
        let {code,message,result} =await getMyHospitalCascadeList()
        try {
          console.log(code);
          if(code==200){
            // let obj={label:"区域",value:""};
            this.options1 = result;     //获取区域下拉框
            console.log("this.options1",this.options1)
          }
          
        } catch (error) {
          
        }
      },
      // 按照区域查询统计方式
      async watchMethod(){
          let params = {
            parentId:this.value1
          }
          let {code,result,message} = await listSelect()
          try {
            if(code==200){
              console.log("result==>",result);
            
              this.options2=result.map((item,index)=>{
                item.label = item.transitCompany;
                item.value = item.id;
                return item
              })
            }
          } catch (error) {
            
          }
      },
      selectArea(value){     //选择区域
        this.watchMethod()
      }
    },
    onShow(){
      this.init()
    }
};
</script>
<style lang="scss" scoped>
/deep/ .u-dropdown__menu{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:0 20rpx;
}
 /deep/ .u-dropdown__menu__item{
        display: flex;
        color: #fff;
       width: 220rpx !important;
        height: 44rpx;
        background: #5B74C7;
        border-radius: 22rpx;
  }
  /deep/ .u-dropdown__menu__item:nth-child(2){
     margin:0 20rpx;
  }
  /deep/ .u-dropdown__menu__item>view{
      padding:0 16rpx;
        width: 220rpx !important;
        display: flex;
        justify-content: space-between;
  }
  /deep/ .u-icon__icon{
      color: #fff !important;
  }
  /deep/ .u-dropdown__menu__item__text,.u-icon__icon{
      color: #fff !important;
  }
.header {
  height: 108rpx;
  background: $my-main-color;
}
</style>