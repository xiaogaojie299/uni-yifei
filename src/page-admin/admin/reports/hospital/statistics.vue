<template>
  <view>
    <view class="header">
      <!-- 下拉框 -->
      <view class="header-item my-box">
        <view class="hospitalName pl-10 nowrap-hidden" @tap="handleHospitalShow">
          {{ selectHos.label||"医院名称"}}
        </view>
        <view class="hospitalName pl-10 nowrap-hidden" @tap="handleStatisticalShow">
          {{ selectStatistical.label||"统计方式"}}
        </view>
        <view v-if="selectStatistical.value!=3" class="hospitalName pl-10 nowrap-hidden" @tap="handleTimerShow">
          {{ timeText||"统计时间"}}
        </view>
        <view v-else class="hospitalName pl-10 nowrap-hidden" @tap="handleQuarterShow">
          {{quarterYear.value?quarterYear.value+'年'+selectQuarter.label:"统计时间"}}
        </view>
      </view>
    </view>
    <view class="main" v-if="tableTitle.length>0">
      <view class="my-box pt-20">
        <view class="main-title"> 医疗废物转移联单 </view>
        <!-- 详情 -->
        <view class="detail-box">
          <view class="">医疗卫生机构名称：{{tableData.departmentName}}</view>
          <!-- <view class="">医疗废物处置单位：{{tableData.transitConfigName}}</view> -->
          <view class="">时间：2020年{{timeStar.split(" ")[0].split("-")[1]}}月</view>
        </view>
      </view>
      <!-- table表格 -->
      <hospitalStatTable :tableData="tableData"></hospitalStatTable>
    </view>
    <view class="footer"></view>
     <!-- 下拉选择框 -->
     <!-- 医院名称 -->
      <area-drop-down ref="childMethod" :list="areaList" @selectRow="selectRow"></area-drop-down>
    <!-- 统计方式 -->
    <u-select v-model="statisticalShow" mode="single-column" :list="statisticalList" @confirm="confirmStatistical"></u-select>
    <!-- 开始时间 -->
    <u-picker mode="time" v-model="timerShow" :params="timerParams" @confirm="confirmTimer"></u-picker>
    <!-- 按照季度 -->
    <u-select v-model="quarterShow" mode="mutil-column" :list="quarterList" @confirm="confirmQuarter"></u-select>  
  </view>
</template>
<script>
import { getMyHospitalCascadeList, listSelect,getTransformList,getHospitalReportList } from "@/utils/api.js";
import {getTimeType} from "@/utils/getData.js"
import hospitalStatTable from "../tableCmps/hospital-stat-table"
import fullYear from "@/utils/year"
import areaDropDown from "@/compontens/my-drop-down/area-drop-down"
export default {
  data() {
    return {
      timeStar:"",         //月份开始
      timeEnd:"",          //月份结束
      tableData:{},       //表格中的数据
      tableTitle:[],
      areaList:{},    //医院列表
      statisticalList:[
          // {
					// 	value: '1',
					// 	label: '日期统计'
					// },
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
      quarterList:[[{
						value: '-01-01 00:00:00/-03-31 23:59:59',
						label: '第一季度'
					},
					{
						value: '-04-01 00:00:00/-06-30 23:59:59',
						label: '第二季度'
          },
          {
						value: '-07-01 00:00:00/-09-30 23:59:59',
						label: '第三季度'
          },
          {
						value: '-10-01 00:00:00/-12-31 23:59:59',
						label: '第四季度'
          }]],
      timerParams:{
          year: true,
					month: true,
          day: true,
      },
      hospitalShow:false,         //控制医院选择select框开关
      statisticalShow:false,      //控制统计时间
      timerShow:false,          //控制时间显示
      quarterShow:false,        //控制季度显示
      selectHos:{},        //选择的医院
      selectStatistical:[],  //选择统计方式
      selectTime:[],         // 选择统计时间
      selectQuarter:[],       //选择的季度
      quarterYear:"",          //选择季度的年份
      timeText:""               //选择时间时候的文本
    };
  },
  computed:{
    
  },
  components:{
    hospitalStatTable,
    areaDropDown
  },
  watch:{
    selectStatistical(){
      console.log("监听成功");
      this.selectTime=[];
      this.selectQuarter=[];
    },
    deep:true
  },
  created(){
      this.areaList = JSON.parse(uni.getStorageSync("area"));
    let year = fullYear();
    this.quarterList.unshift(year);
    console.log('hhh',this.quarterList);
  },
  methods: {
    handleHospitalShow(){   //多选框的显示与隐藏
      this.childMethod=true;
      this.$refs.childMethod.openShow()
    },
    handleStatisticalShow(){   //多选框的显示与隐藏
      this.statisticalShow=true;
    },
    handleTimerShow(){
      this.timerShow=true;
    },
    handleQuarterShow(){
      this.quarterShow=true;
    },
    selectRow(row){ //点击确定
      this.selectHos=row;
      console.log(this.selectHos);
    },
    confirmStatistical(e){
      this.selectStatistical=e[0];
      switch(this.selectStatistical.value){
        case "2":
          this.timerParams.day=false;
          break;
          case "4":
            this.timerParams.day=false;
            this.timerParams.month=false;
          break;
          default:
            this.timerParams.day=true;
            this.timerParams.month=true;
            this.timerParams.month=true;
      }
      console.log(this.timerParams);
    },
     confirmTimer(e){
       this.selectTime=e;
       let {year,month} = e;
       console.log(e.month==undefined);
       if(e.day==undefined && e.month!=undefined){  //按月查询
        let monthDays=new Date(year,month,0).getDate(); //判断当前月有多少天
        this.timeStar=`${year}-${month}-01 00:00:00`;
        this.timeEnd=`${year}-${month}-${monthDays} 23:59:59`;
        this.timeText =`${year}/${month}` 
       }else if(e.month==undefined){    //按年查询
        this.timeStar=`${year}-01-01 00:00:00`;
        this.timeEnd=`${year}-12-31 23:59:59`;
        this.timeText =`${year}年` 
       }
       else{
        //  选择开始日期和结束日期的 （这里逻辑还没有写）
        this.timeStar=`${year}-${month}-01 00:00:00`;
        this.timeEnd=`${year}-${month}-${monthDays} 23:59:59`;
       }
       this.getTableList()    //调用获取 表格数据的方法
    },
    confirmQuarter(e){
      console.log(e);
      this.selectQuarter=e[1];     //选择季度
      this.quarterYear=e[0];      // 选择季度年份
      let timer = e[1].value.split("/");
      this.timeStar=e[0].value+timer[0];
      this.timeEnd=e[0].value+timer[1];
      this.getTableList()    //调用获取 表格数据的方法
    },
    async init() {
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
      let params = {
        departmentId:this.selectHos.value,
        statisticalWayType:this.selectStatistical.value,
        startTime:this.timeStar,
        endTime:this.timeEnd
      }
      console.log("params=",params);
      let {code,result,msg} =await getHospitalReportList(params);
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