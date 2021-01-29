<template>
  <view>
    <view class="header">
      <!-- 下拉框 -->
      <view class="dropdown" @click.stop="open">
        <view class="dropdown_hosp">
          <view @click="goTree" class="flex-ver-center select nowrap-hidden">
            <text class="nowrap-hidden">{{selectTree.label||"请选择医院"}}</text> <u-icon name="arrow-down"></u-icon>
          </view>
        </view>
        <view class="dropdown_hosp">
          <view @click="selectArea" class="flex-ver-center select nowrap-hidden">
            <text class="nowrap-hidden">{{selectCmp.label||"运输公司"}}</text> <u-icon name="arrow-down"></u-icon>
          </view>
        </view>
        <view class="dropdown_hosp">
          <view @tap="selTime" class="flex-ver-center select nowrap-hidden">
            <text class="nowrap-hidden">{{timeText||"请选择时间"}}</text> <u-icon name="arrow-down"></u-icon>
          </view>
        </view>
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
      <transfer-table v-if="tableData.length>0" :tableData="tableData"></transfer-table>
      <no-data v-else></no-data>
    </view>
    <!-- 选择运输公司 -->
    <s-select mode="mutil-column-auto" title="角色" v-model="roleShow" label-name="transitCompany" :default-value="selectIndex2" value-name="id" :list="options2" @confirm="roleBack"></s-select>
    <!-- 选择年月 -->
     <s-picker v-model="timerShow" mode="time" @confirm="confirmTimer" :params="{year: true,month: true,day: false,}" :default-time="defaultMonthTime"></s-picker>
    <view class="footer"> </view> 
  </view>
</template>
<script>
import { getMyHospitalCascadeList, listSelect,getTransformList } from "@/utils/api.js";
import {getTimeType} from "@/utils/getData.js"
import transferTable from "./tableCmps/transfer-table"
import sSelect from '@/compontens/s-select';
import sPicker from '@/compontens/s-picker';
export default {
  data() {
    return {
      roleShow:false,   // 运输单位弹起框
      timerShow:false,  // 时间选择器弹出
      defaultMonthTime:"", // 默认显示的时间
      selectCmp:{},     // 选择的运输公司u
      value1: "",      // 选择医院值
      value2: "",      // 选择运输单位值
      value3: "",     // 选择月份值
      options1: [],   // 医院列表
      options2: [],   //运输列表
      title1:"",      //选中的菜单标题1
      title2:"",      //选中的菜单标题2
      title3:"",      //选中的菜单标题3
      selectIndex1:"",   //获取医院的下标
      selectIndex2:[0],   //获取运输单位的下标
      selectIndex3:"",     //获取月份的下标
      disTransport:null,
      disMonth:null,
      timeStar:"",         //月份开始
      timerEnd:"",          //月份结束
      timeText:"",
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
    transferTable,sSelect,sPicker
  },
  watch:{
    selectTree(){
        console.log("监听成功");
        this.watchMethod();
        this.reload()
    },
      deep:true
  },
  onBackPress(e){ // 左侧自定义导航
            uni.switchTab({
                url:"../index"
            })
        return true
    },
  methods: {
    open(){
      if(JSON.stringify(this.selectTree)=="{}"){
        this.disTransport = true;
      }
    },
    reload(){// 初始化数据
      this.options2 = [];
      this.selectCmp = {};
      this.selectIndex2 =[];
      this.defaultMonthTime = "";
      this.timeStar = "";         //月份开始
      this.timerEnd = "";          //月份结束
      this.timeText="";
    },
    roleBack(obj){  // 运输单位选择确定
       // this.selectIndex1=value;
      // this.title1=this.options1[this.selectIndex1].label;
      // this.$refs.uDropdown()
      // this.title1=this.options1[value].label
      this.options2.forEach((item,index)=>{
          if(item.id == obj[0].value){
              this.selectIndex2 = [index];
          }
      })
      this.timeDisab = false;
      this.selectCmp = obj[0];
    },
    selTime(){
      if(!this.selectCmp.value){
       return uni.showToast({
          title:"请选择运输公司",
          icon:"none"
        })
      }
      this.timerShow = true;
    },
    confirmTimer(obj){ //选择时间确定
      console.log(obj);
      //  this.selectTime=obj;
       let {year,month} = obj;
       let monthDays=new Date(year,month,0).getDate(); //判断当前月有多少天
        this.timeStar=`${year}-${month}-01 00:00:00`;
        this.timeEnd=`${year}-${month}-${monthDays} 23:59:59`;
        console.log(this.timeEnd);
        this.timeText =`${year}-${month}`;
        this.defaultMonthTime=`${year}-${month}-10`;
        this.getTableList()
    },
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
      console.log("value==>",value)
      let { code, result, message } = await listSelect(params);
      try {
        if (code == 200) {
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
      if(!this.selectTree.value){
       return uni.showToast({
          title:"请选择医院",
          icon:"none"
        })
      }
      if(!this.selectCmp.value){
       return uni.showToast({
          title:"请选择运输公司",
          icon:"none"
        })
      }
      if(!this.timeStar){
       return uni.showToast({
          title:"请选择时间",
          icon:"none"
        })
      }
      /* 
      let params={
        departmentId:this.options1[this.value1].realValue, //医院区域ID
        transitCompany:this.value2, //运输处置中心
        startTime:this.timeStar,
        endTime:this.timerEnd
      }
      */
     this.tableData = [];
     this.tableTitle=null;
     let {value,label} = this.selectTree;
      let params={
        departmentId:value, //医院区域ID
        transitCompany:this.selectCmp.value, //运输处置中心
        startTime:this.timeStar,
        endTime:this.timeEnd
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
      if(!this.selectTree.value){
        uni.showToast({
          title:"请先选择医院",
          icon:"none"
        })
        return 
      }
      if(this.options2.length==0){
        uni.showToast({
          title:"暂无运输公司",
          icon:"none"
        })
        return 
      }
      //选择区域
      this.roleShow = true;
      // this.selectIndex1=value;
      // this.title1=this.options1[this.selectIndex1].label;
      // this.$refs.uDropdown()
      // this.title1=this.options1[value].label
      // this.watchMethod();
    },
    selectUnit(value){
      this.selectIndex2=value;
    },
    selectMonth(value){
      this.selectIndex3=value;
      this.title3=this.options3[this.selectIndex3].label;
      this.timerType(value);
      // if(!this.value2){
      //   return uni.showToast({
      //     "title":"请先选择运输单位",
      //     "icon":"none"
      //   })
      // }
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
    // console.log(getTimeType(timeEnd))
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
::v-deep .u-dropdown__menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
}
::v-deep .u-dropdown__menu__item {
  display: flex;
  color: #fff;
  width: 220rpx !important;
  height: 44rpx;
  background: #5b74c7;
  border-radius: 22rpx;
}
::v-deep .u-dropdown__menu__item:nth-child(2) {
  margin: 0 20rpx;
}
::v-deep .u-dropdown__menu__item > view {
  padding: 0 16rpx;
  width: 220rpx !important;
  display: flex;
  justify-content: space-between;
}
::v-deep .u-icon__icon {
  color: #fff !important;
}
::v-deep .u-dropdown__menu__item__text,
.u-icon__icon {
  overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  color: #fff !important;
}
::v-deep .u-dropdown-item__options{
  height: 500rpx !important;
}
.dropdown{
  display: flex;
  .dropdown_hosp{
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
    font-size:22rpx;
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