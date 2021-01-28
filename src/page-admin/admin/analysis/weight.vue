<template>
  <view>
    <view class="header">
      <!-- 下拉框 -->
      <view class="header-item my-box">
        <view class="hospitalName pl-10 nowrap-hidden" @tap="handleHospitalShow">
          {{ selectHos.label||"医院名称"}}
        </view>
        <!-- <view class="hospitalName pl-10 nowrap-hidden" @tap="handleStatisticalShow">
          {{ selectStatistical.label||"统计方式"}}
        </view> -->
        <view v-if="selectStatistical.value!=3" class="hospitalName pl-10 nowrap-hidden" @tap="handleTimerShow">
          {{ timeText||"统计时间"}}
        </view>
        <view v-else class="hospitalName pl-10 nowrap-hidden" @tap="handleQuarterShow">
          {{quarterYear.value?quarterYear.value+'年'+selectQuarter.label:"统计时间"}}
        </view>
      </view>
    </view>
    <!-- <view class="main" v-if="tableTitle.length>0"> -->
      <view class="main" v-if="tableTitle.length>0">
                <view class="qiun-columns">
                    <view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
                        <view class="qiun-title-dot-light">医废各阶段重量走势图</view>
                    </view>
                    <view class="qiun-charts" >
                        <canvas canvas-id="canvasColumnStack" 
                        disable-scroll=true 
                        id="canvasColumnStack" 
                        class="charts"
                        @touchstart="touchLineA" 
                        @touchmove="moveLineA" 
                        @touchend="touchEndLineA"
                        @touchLegend="touchLegendLineA"
                        ></canvas>
                    </view>
                </view>
    </view>
    <view class="footer"></view>
     <!-- 下拉选择框 -->
     <!-- 医院名称 -->
      <area-drop-down ref="childMethod" :list="areaList" @selectRow="selectRow"></area-drop-down>
    <!-- 统计方式 -->
    <u-select v-model="statisticalShow" mode="single-column" :list="statisticalList" @confirm="confirmStatistical"></u-select>
    <!-- 开始时间 -->
    <!-- <u-picker mode="time" v-model="timerShow" :params="timerParams" @confirm="confirmTimer"></u-picker> -->
    <u-calendar v-model="timerShow" month-arrow-color="#000" mode="range" @change="change"></u-calendar>
  </view>
</template>
<script>
import uCharts from '@/compontens/u-charts/u-charts.js';
import {  listSelect , getSegmentWeightStatistics } from "@/utils/api.js";
import {getTimeType} from "@/utils/getData.js"
import fullYear from "@/utils/year"
import areaDropDown from "@/compontens/my-drop-down/area-drop-down"
var _self;
var canvaColumn = null;
let colorArr = [
           "#FFCF00","#FF7800","#7F68FF","#22B926","#E0E0E0","#82FFFF","#E0E0E0","#08B4FF"
         ];
export default {
  data() {
    return {
      timeStar:"",         //月份开始
      timeEnd:"",          //月份结束
      tableData:{},       //表格中的数据
      tableTitle:[],
      areaList:{},    //医院列表
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
      timeText:"",               //选择时间时候的文本
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				serverData:'',
    };
  },
  computed:{
    
  },
  components:{
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
  onLoad(){
   _self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(400);
  },
  created(){
      this.areaList = JSON.parse(uni.getStorageSync("hospital"));
  },
  methods: {
      showColumnStack(canvasId,chartData){  //标准曲线图
				canvaColumn=new uCharts({
                    $this:this,
                    canvasId: canvasId,
                    type: 'line',           //type:'mix'  曲线
                    legend:{
                        show:true,
                        fontColor:"#ee9012"
                        },
                    fontSize:11,
                    background:'#FFFFFF',
                    pixelRatio:1,
                    animation: true,
                    categories: chartData.categories,
                    series: chartData.series,
                    enableScroll:true,
                    xAxis: {
                            type: 'grid',
					        gridColor: '#CCCCCC',
					        gridType: 'dash',
					        dashLength: 8,
                            scrollShow:true,
                            itemCount:4,
                            // disableGrid:true,
                            // itemCount:4,
                            // gridType:'dash',
                            // scrollShow:true,
                            /* 
                                disableGrid:false,
                                type:'grid',
                                gridType:'dash',
                                itemCount:4,
                                scrollShow:true,
                                scrollAlign:'left',
                                scrollBackgroundColor:'#F7F7FF',
                                scrollColor:'#DEE7F7',
                            */
                    },
                    yAxis: {
                        //disabled:true
                        format: val => {
						return val + 'kg';
					}
                    },
                    dataLabel: false,
                    width: this.cWidth,
                    height: this.cHeight,
                    extra: {
                        line: {
                            type:'straight'
                        }
                    }
				});
				
			},
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
    change(e){  //选择时间统计
        console.log("选择起始时间-结束时间",e);
        this.timeText = e.startDate + "" + e.endDate;
        this.timeStar=`${e.startDate} 00:00:00`;
        this.timeEnd=`${e.endDate} 23:59:59`;
        this.getTableList() //获取数据
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
      // statisticalWayType:this.selectStatistical.value,
      let params = {
        departmentId:this.selectHos.value,
        startTime:this.timeStar,
        endTime:this.timeEnd
      }
      console.log("params=",params);
      let {code,result,msg} =await getSegmentWeightStatistics(params);
      try{
        if(code==200){
            // 测试数据

            let params ={
                categories: ['2012-10', '2013', '2014', '2015', '2016', '2017'],
						series: [
							{
								name: '',
								data: [35, 8, 25, 37, 4, 20],
								type: 'line',
								style: 'curve', //这里的类型改成曲线 curve  默认是 straight直线
								color: '#1890ff'
                            },
                            {
								name: '',
								data: [32, 18, 125, 237, 34, 220],
								type: 'line',
								style: 'curve', //这里的类型改成曲线 curve  默认是 straight直线
								color: '#1890ff'
                            }
						]
					}
         let arr = [];  //条形统计图格式转换
         result.dataList.forEach((item,index)=>{
             item.style = 'curve';
             item.type ='line';
        })
         let ColumnStack ={categories:[],series:[]};  //条形统计图参数
         ColumnStack.categories = result.xAxis;
         ColumnStack.series = result.dataList;
         console.log(ColumnStack.series);
        _self.showColumnStack("canvasColumnStack",ColumnStack);
          this.tableData=result;
          this.tableTitle=result.dataList;
      }  
      }catch(e){
        //TODO handle the exception
        console.log(e);
      }
      
    },
    touchColumn(e){
				canvaColumn.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
            },
    touchLineA(e){
                canvaColumn.scrollStart(e);
            },
    moveLineA(e) {
        canvaColumn.scroll(e);
    },
    touchEndLineA(e) {
        canvaColumn.scrollEnd(e);
        //下面是toolTip事件，如果滚动后不需要显示，可不填写
        canvaColumn.showToolTip(e, {
            format: function (item, category) {
                return category + ' ' + item.name + ':' + item.data 
            }
        });
        canvaColumn.touchLegend(e)
    },
    // touchLegendLineA(e){
    //     canvaColumn.touchLegend(e)
    // },

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
::v-deep .u-calendar__action .u-icon__icon{
    color:#000 !important
}
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
    width:320rpx;
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
  .qiun-columns{display:flex; flex-direction:column !important;}
.qiun-common-mt{margin-top:10upx;}
.qiun-bg-white{background:#FFFFFF;}
.qiun-title-bar{width:96%; padding:10upx 2%; flex-wrap:nowrap;}
.qiun-title-dot-light{border-left: 10upx solid #0ea391; padding-left: 10upx; font-size: 32upx;color: #000000}
.qiun-charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
.charts{width: 750upx; height:500upx;background-color: #FFFFFF;}
</style>