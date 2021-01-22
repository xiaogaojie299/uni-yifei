<template>
  <view>
    <view class="header">
      <!-- 下拉框 -->
      <view class="dropdown">
        <view class="dropdown_hosp">
          <view @click="goTree" class="flex-ver-center select nowrap-hidden">
          <text class="nowrap-hidden">{{selectTree.label||"请选择医院"}}</text> <u-icon name="arrow-down"></u-icon>
          </view>
        </view>
        <u-dropdown height="100" duration="0">
            <!-- @change="selectArea" -->
            <!-- :title="options1[selectIndex1]||'选择医院'" -->
          <!-- <u-dropdown-item
          v-show="true"
            disabled
            v-model="value1"
            :title="title1||'请选择医院'"
            :options="options1"
            @change="selectArea"
          ></u-dropdown-item> -->

           <u-dropdown-item
            disabled
          ></u-dropdown-item>

          <!-- :title="options2[selectIndex2].label||'运输单位'" -->
          <u-dropdown-item
            v-model="value2"
            :title="value2||'运输方式'"
            :options="options2"
            :disabled="!selectTree.label"
            @change="selectUnit"
          ></u-dropdown-item>
          <!-- :disabled="!value2" -->
          <u-dropdown-item
            v-model="value3"
            :title="title3||'选择月份'"
            @change="selectMonth"
            :options="options3"
          ></u-dropdown-item>
        </u-dropdown>
      </view>
    </view>
    <view class="main" v-if="tableTitle.length>0">
      <view class="my-box pt-20">
        <view class="main-title"> 医疗废物转移联单 </view>
        <!-- 详情 -->
        <view class="detail-box">
          <view class="">医疗卫生机构名称：{{tableData.departmentName}}</view>
          <view class="">医疗废物处置单位：{{tableData.transitConfigName}}</view>
          <view class="">时间：2020年{{timeStar.split(" ")[0].split("-")[1]}}月</view>
        </view>
      </view>
      <!-- table表格 -->
      <transfer-table :tableData="tableData"></transfer-table>
    </view>
    <view class="footer"> </view>
  </view>
</template>
<script>
import { getMyHospitalCascadeList, listSelect,getTransformList } from "@/utils/api.js";
import {getTimeType} from "@/utils/getData.js"
import transferTable from "./tableCmps/transfer-table"
export default {
  data() {
    return {
      value1: "",      // 选择医院值
      value2: "",      // 选择运输单位值
      value3: "",     // 选择月份值
      options1: [],   // 医院列表
      options2: [],   //运输列表
      options3:[
        {realValue:0, value:0,label:"一月",},
        {realValue:1, value:1,label:"二月"},
        {realValue:2, value:2,label:"三月"},
        {realValue:3, value:3,label:"四月"},
        {realValue:4, value:4,label:"五月"},
        {realValue:5, value:5,label:"六月"},
        {realValue:6, value:6,label:"七月"},
        {realValue:7, value:7,label:"八月"},
        {realValue:8, value:8,label:"九月"},
        {realValue:9, value:9,label:"十月"},
        {realValue:10, value:10,label:"十一月"},
        {realValue:11, value:11,label:"十二月"},
      ],    //月份列表
      title1:"",      //选中的菜单标题1
      title2:"",      //选中的菜单标题2
      title3:"",      //选中的菜单标题3
      selectIndex1:"",   //获取医院的下标
      selectIndex2:"",   //获取运输单位的下标
      selectIndex3:"",     //获取月份的下标
      timeStar:"",         //月份开始
      timerEnd:"",          //月份结束
      tableData:{},       //表格中的数据
      tableTitle:[],
      selectTree:{},    // 选中的科室
    };
  },
  computed:{
    tableWidth(){
       let length = this.tableTitle.length;
      return `width:calc(${length} * 320rpx)`
    }
  },
  components:{
    transferTable
  },
  watch:{
    selectTree(){
        console.log("监听成功");
        this.watchMethod();
    },
      deep:true
  },
  methods: {
    async init() {
      let { code, message, result } = await getMyHospitalCascadeList();
      try {
        console.log(code);
        if (code == 200) {
          // let obj={label:"区域",value:""};
          this.options1 = result.map((item,index)=>{
            item.test = item.value;
            item.value = index;
            item.realValue=item.test
            return item
          }); //获取区域下拉框
        }
      } catch (error) {}
    },
    goTree(){
      let params= this.selectTree;
      params.checkOnlyLeaf = true;
      this.$goTree(params);
    },
    // 按照区域查询统计方式
    async watchMethod() {
      let {value,label} = this.selectTree;
      let params = {
        parentId: value,
      };
      let { code, result, message } = await listSelect();
      try {
        if (code == 200) {
          console.log("result==>", result);
          this.options2 = result.map((item, index) => {
            item.label = item.transitCompany;
            item.value = item.transitCompany;
            // item.realValue=item.id;
            return item;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取表单数据
    async getTableList(){
      /* 
      let params={
        departmentId:this.options1[this.value1].realValue, //医院区域ID
        transitCompany:this.value2, //运输处置中心
        startTime:this.timeStar,
        endTime:this.timerEnd
      }
      */
     let {value,label} = this.selectTree;
      let params={
        departmentId:value, //医院区域ID
        transitCompany:"处置中心", //运输处置中心
        startTime:this.timeStar,
        endTime:this.timerEnd
      }
      try {
        let {code,result,message} = await getTransformList(params);
        this.tableData = result;
        this.tableTitle=result.legend;  //表头菜单
        //this.tableData =result.list;    //表格中的数据
      } catch (error) {
        
      }
    },
    selectArea(value) {
      //选择区域
      this.selectIndex1=value;
      this.title1=this.options1[this.selectIndex1].label;
      // this.$refs.uDropdown()
      // this.title1=this.options1[value].label
      
      this.watchMethod();
    },
    selectUnit(value){
      this.selectIndex2=value;
    },
    selectMonth(value){
      this.selectIndex3=value;
      this.title3=this.options3[this.selectIndex3].label;
      this.timerType(value);
      // 选择月份调用获取table方法
      this.getTableList()
    },
    // 时间转化工具
    timerType(value3){
    var now = new Date(2020,value3,1); //当前日期
    var nowMonth = now.getMonth(); //当前月 
    console.log(nowMonth); 
    var nowYear = now.getFullYear(); //当前年 
    //本月的开始时间
    var monthStartDate = new Date(nowYear, nowMonth, 1); 
    //本月的结束时间
    var monthEndDate = (new Date(nowYear, nowMonth+1, 1));
    var timeStar=Date.parse(monthStartDate);//s
    var timeEnd=(Date.parse(monthEndDate)-1000);//s
    console.log(getTimeType(timeStar))
    this.timeStar=getTimeType(timeStar)+" 00:00:00";
    this.timerEnd=getTimeType(timeEnd)+" 23:59:59";
    }
  },
  onShow() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
/deep/ .u-dropdown__menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
}
/deep/ .u-dropdown__menu__item {
  display: flex;
  color: #fff;
  width: 220rpx !important;
  height: 44rpx;
  background: #5b74c7;
  border-radius: 22rpx;
}
/deep/ .u-dropdown__menu__item:nth-child(2) {
  margin: 0 20rpx;
}
/deep/ .u-dropdown__menu__item > view {
  padding: 0 16rpx;
  width: 220rpx !important;
  display: flex;
  justify-content: space-between;
}
/deep/ .u-icon__icon {
  color: #fff !important;
}
/deep/ .u-dropdown__menu__item__text,
.u-icon__icon {
  overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  color: #fff !important;
}
/deep/ .u-dropdown-item__options{
  height: 500rpx !important;
}
.dropdown{
  display: flex;
  position: relative;
  .dropdown_hosp{
    position: absolute;
    padding-left: 10rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index:1000;
    .select{
      font-size: 15px;
      color: #ffffff;
      width: 240rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:0 20rpx;
    height: 44rpx;
    border-radius: 12px;
    background: #5b74c7;
    text{
      width: 200rpx;
    }
    }
  }
}
.header {
  height: 108rpx;
  background: $my-main-color;
}
.main {
  .main-title {
    height: 40rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 40rpx;
  }
  .detail-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 142rpx;
    font-size: 24rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #828282;
    line-height: 34rpx;
  }
  .main-table {
    .no-col {
        min-width: 210rpx;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
    .t-header {
      height: 96rpx;
      background: $my-main-color;
      font-size: 24rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      .tr {
        height: 100%;
        display: flex;
        .th {
          width: 600rpx !important;
          border: 1px solid red;
          height: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          .col-span {
            display: flex;
            width: 100%;
            height: 48rpx;
            border-top: 1px solid #3b5fd3;
            view {
              width: 50%;
              height: 100%;
            }
            view:nth-of-type(1) {
              border-right: 1px solid #3b5fd3;
            }
          }
        }
      }
      .tr .th:nth-of-type(2) {
        border-left: 1px solid #3b5fd3;
        border-right: 1px solid #3b5fd3;
      }
    }
    .t-body {
      & .tr:nth-of-type(2n) {
        border-top: 0;
        border-bottom: 0;
        background: #f7f9ff;
      }
      & .tr:last-child {
        border-top: 0;
        border-bottom: 1px solid #eaeaea;
      }
      .tr {
        width: 100%;
        height: 48rpx;
        display: flex;
        border: 1px solid #eaeaea;

        .th {
          width: 270rpx;
          height: 100%;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          .col-span {
            display: flex;
            width: 100%;
            height: 100%;
            view {
              width: 50%;
              height: 100%;
            }
            view:nth-of-type(1) {
              border-right: 1px solid #eaeaea;
            }
          }
        }
      }
      .tr .th:nth-of-type(2) {
        border-left: 1px solid #eaeaea;
        border-right: 1px solid #eaeaea;
      }
    }
  }
}
</style>