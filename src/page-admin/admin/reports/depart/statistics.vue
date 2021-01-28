<template>
  <view>
    <view class="header">
      <view class="">
      </view>
      <!-- 下拉框 -->
      <view class="header-item my-box">
        <view class="hospitalName pl-10 nowrap-hidden" @tap="handleHospitalShow">
          {{ selectTree.label||"请选择医院"}}
        </view>
        <view class="hospitalName pl-10 nowrap-hidden" @tap="handleStatisticalShow">
          {{ selectStatistical.label||"统计方式"}}
        </view>
        <!-- <view v-if="selectStatistical.value!=3" class="hospitalName pl-10 nowrap-hidden" @tap="handleTimerShow">
          {{ timeText||"统计时间"}}
        </view> -->
        <view v-if="selectStatistical.value==1" class="hospitalName pl-10 nowrap-hidden" @tap="handle_time">
          {{ timeText||"统计时间"}}
        </view>
        <view v-else-if="selectStatistical.value==3" class="hospitalName pl-10 nowrap-hidden" @tap="handleQuarterShow">
          <!-- {{quarterYear.value?quarterYear.value+'年'+selectQuarter.label:"统计时2"}} -->
          {{timeText ||"统计时间" }}
        </view>
        <view v-else class="hospitalName pl-10 nowrap-hidden" @tap="handleTimerShow">
          {{ timeText||"统计时间"}}
        </view>
      </view>
    </view>
    <view class="main" v-if="tableTitle.length>0">
      <view class="my-box pt-20">
        <!-- <view class="main-title"> 医疗废物转移联单 </view> -->
        <view class="main-title"> {{tableData.departmentName}}医疗废物报表 </view>
        <!-- 详情 -->
        <view class="detail-box">
          <view class="">医疗卫生机构名称：{{tableData.departmentName}}</view>
          <!-- <view class="">医疗废物处置单位：{{tableData.transitConfigName}}</view> -->
          <view class="">时间：2020年{{timeStar.split(" ")[0].split("-")[1]}}月</view>
        </view>
      </view>
      <!-- table表格 -->
      <statistics-table :tableData="tableData"></statistics-table>
    </view>
    <view class="footer"></view>
     <!-- 下拉选择框 -->
     <!-- 选择开始时间和起止时间 -->
     <u-calendar v-model="endTimeShow" mode="range" @change="change"></u-calendar>
     <!-- <my-calendar> </my-calendar> -->
     <!-- 医院名称 -->
      <!-- <u-select v-model="hospitalShow" mode="mutil-column-auto" :list="hospitalList" @confirm="confirmHospital"></u-select> -->
    <!-- 统计方式 -->
    <u-select v-model="statisticalShow" :default-value="statisticalIndex" mode="single-column" :list="statisticalList" @confirm="confirmStatistical"></u-select>
    <!-- 开始时间 -->
    <u-picker v-if="selectStatistical.value==2" mode="time" v-model="timerShow" :params="timerParams" :default-time="defaultMonthTime" @confirm="confirmTimer"></u-picker>
    <!-- <s-picker v-if="selectStatistical.value==2" v-model="timerShow" mode="time" @confirm="confirmTimer" :params="timerParams" :default-time="defaultMonthTime"></s-picker> -->
    <u-picker v-else mode="time" v-model="timerShow" :params="{year: true,month: false,day: false,}" :default-time="defaultYearTime" @confirm="confirmTimer"></u-picker>
    <!-- <s-picker v-model="timerShow" mode="time" @confirm="confirmTimer" :params="timerParams" :default-time="defaultTime"></s-picker> -->
    <!-- 按照季度 -->
    <u-select v-model="quarterShow" title="选择季度" mode="mutil-column" :list="quarterList" :default-value="quarterIndex" @confirm="confirmQuarter"></u-select>  
    <!-- <s-select v-model="quarterShow" title="选择季度" mode="mutil-column" :list="quarterList" :default-value="quarterIndex" @confirm="confirmQuarter" /> -->
  </view>
</template>
<script>
import { getMyHospitalCascadeList, listSelect,getTransformList,getOfficeReportList } from "@/utils/api.js";
import {getTimeType} from "@/utils/getData.js"
import statisticsTable from "../tableCmps/statistics-table"
import fullYear from "@/utils/year"
import mixins from "@/mixins/mx-calendar"
import sSelect from '@/compontens/s-select';
import SSelect from '../../../../compontens/s-select.vue';
import sPicker from '@/compontens/s-picker';
export default {
  mixins:[mixins],
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
      timeEnd:"",          //月份结束
      tableData:{},       //表格中的数据
      tableTitle:[],
      hospitalList:{},    //医院列表
      statisticalList:[
          {
						value: '1',
						label: '日期统计'
					},
					{
						value: '2',
						label: '月度统计'
          },
          {
						value: '3',
						label: '季度统计'
          },
          {
						value: '4',
						label: '年度统计'
          },
      ],
      quarterIndex:[1,0], // 季度默认选中
      statisticalIndex:[0],  // 记录统计选中下标
      defaultMonthTime:"",
      defaultYearTime:"",
      quarterList:[[{
            value:0,
						time: '-01-01 00:00:00/-03-31 23:59:59',
            label: '第一季度',
					},
					{
            value:1,
						time: '-04-01 00:00:00/-06-30 23:59:59',
						label: '第二季度'
          },
          {
            value:2,
						time: '-07-01 00:00:00/-09-30 23:59:59',
						label: '第三季度'
          },
          {
            value:3,
						time: '-10-01 00:00:00/-12-31 23:59:59',
						label: '第四季度'
          }]],
      timerParams:{
          year: true,
					month: true,
          day: true,
      },
      selectTree:{},            //选择的医院 (从上个页面传过来的)
      hospitalShow:false,         //控制医院选择select框开关
      statisticalShow:false,      //控制统计时间
      timerShow:false,          //控制时间显示
      quarterShow:false,        //控制季度显示
      selectStatistical:[],  //选择统计方式
      selectTime:[],         // 选择统计时间
      endTimeShow:false,    // 起始时间选择
      selectQuarter:[],       //选择的季度
      quarterYear:"",          //选择季度的年份
      timeText:""               //选择时间时候的文本
    };
  },
  computed:{
  },
  components:{
    statisticsTable,
    SSelect,
    sPicker
  },
  watch:{
    "selectStatistical":{
      handler(){
        this.selectTime=[];
        this.selectQuarter=[];
        this.timeText = "";
        this.defaultMonthTime ="";
        this.defaultYearTime="";
      },
      // this.selectTime=[];
      // this.selectQuarter=[];
      deep:true,
    },
    "selectTree":{
      handler(){
        if(this.selectStatistical.value && this.timeStar &&this.timeEnd){
          this.getTableList();
        }
      },
      deep:true
    }
  },
  created(){
    let year = fullYear();
    year.forEach(item=>{
      if(item.defaultIndex){
        this.quarterIndex[0] = item.defaultIndex
      }
    })
    this.quarterList.unshift(year);
  },
  onBackPress(event){
    this.$store.commit('setCheckedNodes',{});
  },
  methods: {
    change(e){
        this.timeText = e.startDate + "" + e.endDate;
        this.timeStar=`${e.startDate} 00:00:00`;
        this.timeEnd=`${e.endDate} 23:59:59`;
        this.getTableList() //获取数据
    },
    handle_time(){  // 按日期选择开始时间和结束时间
      // this.$refs.childNode
      // this.$refs.childNode.handle_close();
      if(!this.selectStatistical.value){ // 判断是否选择统计方式
        return  uni.showToast({
          title:"请选择统计方式",
          icon:"none"
        })
      }
      this.endTimeShow = true;
    },
    handleHospitalShow(){   //多选框的显示与隐藏
      // this.hospitalShow=true;
      let params=this.selectTree;
      params.checkOnlyLeaf = true;  // 只能选择医院
      this.$goTree(params);
    },
    handleStatisticalShow(){   //多选框的显示与隐藏
      if(!this.selectTree.value){ // 判断是否选择医院
        return  uni.showToast({
          title:"请选择医院",
          icon:"none"
        })
      }
      this.statisticalShow=true;
    },
    
    handleTimerShow(){
      if(!this.selectStatistical.value){ // 判断是否选择统计方式
        return  uni.showToast({
          title:"请选择统计方式",
          icon:"none"
        })
      }
      // 默认显示的时间，2025-07-02 || 2025-07-02 13:01:00 || 2025/07/02
       this.defaultTime = "2020-01";
      this.timerShow=true;
    },
    handleQuarterShow(){
      if(!this.selectStatistical.value){ // 判断是否选择统计方式
        return  uni.showToast({
          title:"请选择统计方式",
          icon:"none"
        })
      }
      this.quarterShow=true;
    },
    confirmStatistical(e){
      console.log(e);
      this.clearTable()
      this.statisticalIndex=[e[0].value -1]
      this.selectStatistical=e[0];
      switch(this.selectStatistical.value){
        case "2":
          this.timerParams.day=false;
          this.timerParams.month=true;
          this.timerParams.year=true;
          break;
          case "4":
            this.timerParams.day=false;
            this.timerParams.month=false;
          break;
          default:
            this.timerParams.day=true;
            this.timerParams.month=true;
            this.timerParams.year=true;
      }
      console.log(this.timerParams);
    },
    clearTable(){ // 清空table
      this.tableData = {};       //表格中的数据
      this.tableTitle =[];
      this.timeStar=``;
      this.timeEnd=``;
    },
     confirmTimer(e){
       this.selectTime=e;
       let {year,month} = e;
       console.log(e.month==undefined);
       if(e.day==undefined && e.month!=undefined){  //按月查询
        let monthDays=new Date(year,month,0).getDate(); //判断当前月有多少天
        this.timeStar=`${year}-${month}-01 00:00:00`;
        this.timeEnd=`${year}-${month}-${monthDays} 23:59:59`;
        this.timeText =`${year}-${month}`;
        this.defaultMonthTime=`${year}-${month}-10`;
        console.log("timerParams=",this.timerParams);
        console.log("this.defaultMonthTime==>",this.defaultMonthTime);
       }else if(e.month==undefined){    //按年查询
        this.timeStar=`${year}-01-01 00:00:00`;
        this.timeEnd=`${year}-12-31 23:59:59`;
        this.timeText =`${year}年`;
        this.defaultYearTime = `${year}-01-01`;
       }
       else{
        //  选择开始日期和结束日期的 （这里逻辑还没有写）
        this.timeStar=`${year}-${month}-01 00:00:00`;
        this.timeEnd=`${year}-${month}-${monthDays} 23:59:59`;
       }
       this.getTableList()    //调用获取 表格数据的方法
    },
    columnchange(e){
      // 滚动下表
      console.log(e);
    },
    confirmQuarter(e){
      let yearIndex = e[0].value;
      let jiduIndex = e[1].value;
      let year =this.quarterList[0][yearIndex].label;
      this.quarterIndex[0]=yearIndex;
      this.quarterIndex[1]=jiduIndex;
      // this.selectQuarter=e[1].value;     //选择季度
      this.selectQuarter = this.quarterList[1][jiduIndex];
      let timer = this.selectQuarter.time.split("/");
      this.timeStar=year+timer[0];
      this.timeEnd=year+timer[1];
      this.timeText = year +"年"+"-"+e[1].label;
      console.log(this.timeText);
      this.getTableList()    //调用获取 表格数据的方法
    },
    async init() {
      let { code, message, result } = await getMyHospitalCascadeList();
      try {
        if (code == 200) {
            this.hospitalList = result;
            console.log('result==>',result);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 按照区域查询统计方式
    async watchMethod() {
      let params = {
        parentId: this.options1[this.selectIndex1].realValue,
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
      if(!this.selectTree.value){ // 判断是否选择医院
        return  uni.showToast({
          title:"请选择医院",
          icon:"none"
        })
      }
      if(!this.selectStatistical.value){ // 判断是否选择医院
        return  uni.showToast({
          title:"请选择统计方式",
          icon:"none"
        })
      }
       this.tableData = {};       //表格中的数据
      this.tableTitle =[];
      let params = {
        departmentId:this.selectTree.value,
        statisticalWayType:this.selectStatistical.value,
        startTime:this.timeStar,
        endTime:this.timeEnd
      }
      console.log("params=",params);
      let {code,result,msg} =await getOfficeReportList(params);
      try{
        if(code==200){
          console.log(result);
          this.tableData=result;
          this.tableTitle=result.departmentName;
      }  
      }catch(e){
        //TODO handle the exception
      }
      
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
  color: #000 !important;
}
/deep/ .u-dropdown__menu__item__text,
.u-icon__icon {
  overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  color: #000 !important;
}
/deep/ .u-dropdown-item__options{
  height: 500rpx !important;
}
.header {
  height: 108rpx;
  background: $my-main-color;
  // padding: 0 20rpx;
  .header-item{
    background: $my-main-color;
    height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
     .hospitalName{
    width:220rpx;
    height: 44rpx;
    background: #5b74c7;
    border-radius: 20rpx;
    color: #fff;
  }
  }
 
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