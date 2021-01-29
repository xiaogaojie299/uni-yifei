<template>
  <view class="container">
    <view class="header">
      <view class="my-box header-cont">
        <view class="list-item" v-for="(item,index) in list" :key="index" @click="navigateTo(item.url)">
          <img class="" :src="item.imgUrl" alt="" />
          <view class="" style="width:100rpx;">
            <view v-if="index==3" class="font-s-28">
              <span v-if="item.num.length<6">{{item.num+'条'}}</span>
              <u-notice-bar v-else color="white" :play-state="playState" :speed="50" :volume-icon="false" :list="[item.num+'条']"></u-notice-bar>
            </view>
            <view v-else class="font-s-28">
              <!-- {{item.num || 0}}kg -->
              <span v-if="item.num.length<6">{{item.num+'kg'}}</span>
              <u-notice-bar v-else :autoplay="false" color="white" :play-state="playState" :speed="50" :volume-icon="false" :list="[item.num+'kg']"></u-notice-bar>
            </view>
            <view class="font-s-24 nowrap">{{item.title}}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="main"> 
        <view class="my-box"> 
            <!-- 医院收集排行 -->
            <view class="gather-rank">
                <!-- 标题图片 -->
                <view class="gr-head mt-30 flex-center">
                    <!-- <img src="@/static/images/rank_icon.png" /> -->
                    <view class="title">
                        医院收集排行
                    </view>
                </view>
                <!-- 按钮组 -->
                <!-- <view class="btn-groups">
                   <view @tap="selectBtn(index,item.params)" class="btn-item flex-ver-center" :class="{active:index==isActive}" v-for="(item,index) in btns" :key="index">{{item.title}}</view>
                </view> -->
                <btn-group :btns="gatherBtns" @selectBtn="selectGatherBtn" />
                <!-- 统计报表 -->
                <view v-if="chartData.length>0" class="chart">
                  <scroll-view scroll-x="true"  class="scroll-content">
                    <view style="width:1000rpx;">
                      <ChartColumn widgetType="ColumnByTodayRank" :chartData="chartData" />
                    </view>
                  </scroll-view>
                </view>
            </view>
            <!-- 收集总量排行榜 -->

             <view class="gather-rank">
                <!-- 标题图片 -->
                <view class="gr-head mt-30 flex-center">
                    <!-- <img src="@/static/images/rank_icon.png" /> -->
                    <view class="title">
                        医院收集排行
                    </view>
                </view>
                <btn-group :btns="gatherTotalBtns" @selectBtn="selectTotalBtn" />
                <!-- 统计报表 -->
                <view v-if="chartTotalData.length>0" class="chart">
                  <!-- <ChartColumn widgetType="ColumnByTodayCollectTotal" :chartData="chartTotalData" /> -->
                    <!-- 
                      写的太罗嗦了，  不知道echarts在uni中会有这么多问题/ 什么功能都不能用md
                     index===1 是按月显示 需要对scroll进行滑动
                     -->
                    <view class="" v-if="index!=1">
                        <scroll-view scroll-x="true"  class="scroll-content">
                          <view style="width:500px">
                            <ChartColumn widgetType="ColumnByTodayCollectTotal" :chartData="chartTotalData" />
                          </view>
                      </scroll-view>
                    </view>

                   <view v-else class="">
                      <scroll-view scroll-x="true"  class="scroll-content">
                        <view style="width:2000rpx">
                          <monthChart :index="index" :chartData="chartTotalData" />
                        </view>
                    </scroll-view>
                  </view>
                  
                </view>
            </view>
        </view>
    </view>
    <view class="footer"> </view>
  </view>
</template>
<script>
import ChartPie from "@/compontens/chartCmps/ChartPie"
import uCharts from "../../compontens/u-charts/u-charts";
import btnGroup from "./cmps/btn-group"
import ChartColumn from "./cmps/ChartColumn"
import monthChart from "./cmps/monthChart"

import * as utilDate from "@/utils/getData"
import { getMenu,getIndex,getTodayRankList,getLastSevenDaysStatistics,getLastSevenDaysStatisticsX,listWarningRecord } from "@/utils/api.js";
import {getAreaList,getHosList,getProvinceCity} from "@/utils/menuList.js"
var _self;
var canvaColumn = null;
export default {
  
  data() {
    return {
      playState:"paused", // paused 暂停  play滚动继续播放
      chartData:[],
      chartTotalData:[],
      list: [
        { imgUrl: require("@/static/images/collect_icon.png"),title:"今日收集",num:"0"},

        { imgUrl: require("@/static/images/out_store.png"),title:"今日入库",num:"0"},

        { imgUrl: require("@/static/images/put_store.png") ,title:"今日出库",num:"0"},

        { imgUrl: require("@/static/images/early_warn.png"),title:"未处理预警" ,num:"0"},

        { imgUrl: require("@/static/images/no_store.png"),title:"未入库",num:"0"},

        { imgUrl: require("@/static/images/is_store.png"),title:"未出库",num:"0"},
        
      ],
      gatherBtns: [
        { title: "今日",params:utilDate.getToday() },
        { title: "月",params:utilDate.getMonth()},
        { title: "季度",params:utilDate.getQuarter() },
        { title: "半年",params:utilDate.getHalfYear() },
        { title: "年",params:utilDate.getYear()},
      ],
      gatherTotalBtns:[
        { title: "七日",params:utilDate.getSevenDay() },
        { title: "月",params:utilDate.getMonth()},
        { title: "季度",params:utilDate.getQuarter() },
        { title: "半年",params:utilDate.getHalfYear() },
        { title: "年",params:utilDate.getYear()},
      ],
      isActive: 0, //选中
      index:0    // 总量查询选择的下标 来判断图表的宽度
    };
  },
  computed:{
    totalWidth(){
      let index = this.index;
      console.log(index);
      switch (index){
        case 0:
          return `width:694rpx;border:1px solid red;`;
        case 1:
          return `width:2000rpx;border:1px solid red;`
        default: 
        return `width:800rpx;border:1px solid red;`;
      }
    }
  },
  components:{
    ChartColumn,
    btnGroup,
    monthChart
  },
  created(){
    this.getServeData();
    this.getTotalData();
  },
  methods: {
    navigateTo(url) {
      console.log(url);
      url && uni.navigateTo({
        url
      })
    },
    selectGatherBtn(data) { // params是对象 起止时间和终止时间  index是下标
    let {params} = data
      this.getServeData(params)
    },
    selectTotalBtn(data){
      let {params,index} = data;
      this.index = index;
      this.getTotalData(params)
    },
    getServeData(time = utilDate.getToday()){     // 从后台获取今日排行数数据
            getTodayRankList(time).then(resp=>{
                if(resp.code==200){
                  this.chartData = resp.result;
                }
            })
      },
    getTotalData(time = utilDate.getSevenDay()){  // 医废收集总量
    time.type =this.index<2?1:2;
    console.log("time.type==>",time);
      getLastSevenDaysStatisticsX(time).then(resp=>{ 
          if(resp.code==200){
            this.chartTotalData = resp.result.source;
          }
      })
    },
      // 获取出入库记录
  async init(){
    // 获取预警时间详情
   let warResp = await listWarningRecord({pageNo:1,pageSize:6,status: 1})
   let warnTotal = warResp.result.total;
   let res =await getIndex(); // 
   try {
     if(res.code==200){
      //  res.result
      let {todayCheckout,todayCollect,todayStore,totalNonCheckout,totalNonStore}=res.result
      let { startTime, endTime } = utilDate.getToday();
      let timeParams = 'startTime=' + startTime + '&endTime=' + endTime;
      this.list.forEach((item,index)=>{
        switch (index){ 
          case 0:
            item.num = String(todayCollect);    // 今日收集
            item.url = '/pages-mw/mw/collect?' + timeParams
          break;
          case 1:
            item.num= String(todayStore);      // 今日入库
            item.url = '/pages-mw/mw/inventory?' + timeParams
            break;
          case 2:
             item.num= String(todayCheckout);     // 今日出库
            //  item.url = '/pages-mw/mw/checkout?' + timeParams
            item.url = '/pages-mw/mw/outbound?' + timeParams
             break
          case 3:
             item.num = String(warnTotal);   // 未处理预警
             item.url = '/pages-mw/warning/info?warningStatus=1'
             break
          case 4: 
            item.num = String(totalNonStore)     // 未入库
            item.url = '/pages-mw/mw/trace?status=1'
          break;
          case 5: 
            item.num = String(totalNonCheckout)     // 未出库
            item.url = '/pages-mw/mw/trace?status=2'
          break;
          default:
            item.num = "0"
        }
      })
      this.playState = "play"
     }
   } catch (error) {
     console.log(error)
   }
  },
  },
  async onLoad(option) {
    console.log("首页打印成功");
    // getAreaList();
    getHosList();
    // getProvinceCity();
  },

  onShow(){
    this.init()
  }
};
</script>
<style lang="scss" scoped>
::v-deep .u-type-warning-light-bg{
  background: none;
}
.container{
}
.header {
  overflow: hidden;
  width: 100vw;
  height: 280rpx;
  background: $my-main-color;
  .header-cont {
    background: $my-main-color;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .list-item {
      display: flex;
      align-items: center;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #ffffff;
      //   justify-content: flex-end;
      width: 33%;
      height: 140rpx;
      & > img {
        width: 46rpx;
        height: 48rpx;
        margin-right: 16rpx;
      }
    }
  }
  .header-cont :nth-of-type(3n-1) {
    color: white;
    display: flex;
    justify-content: center;
  }
  .header-cont :nth-of-type(3n) {
    color: white;
    display: flex;
    justify-content: flex-end;
  }
}
.main {
  width: 100%;
  .gather-rank {
    .gr-head {
      & > img {
        width: 36rpx;
        height: 36rpx;
        margin-right: 16rpx;
      }
    }
    .btn-groups {
      height: 100rpx;
      line-height:120rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn-item {
        width: 94rpx;
        height: 60rpx;
        border-radius: 30rpx;
        opacity: 0.2;
        border: 2rpx solid #000000;
        font-weight: 500;
      }
      .active {
        background: $my-main-color;
        color: #fff;
        font-weight: 600;
        opacity: 1;
      }
    }
    .chart{
      // margin-top: -80rpx;
    }
  }
}

.page {
  background: #f2f2f2;
  width: 750upx;
  overflow-x: hidden;
}
.qiun-padding {
  padding: 2%;
  width: 96%;
}
.qiun-wrap {
  display: flex;
  flex-wrap: wrap;
}
.qiun-rows {
  display: flex;
  flex-direction: row !important;
}
.qiun-columns {
  display: flex;
  flex-direction: column !important;
}
.qiun-common-mt {
  margin-top: 10upx;
}
.qiun-bg-white {
  background: #ffffff;
}
.qiun-title-bar {
  width: 96%;
  padding: 10upx 2%;
  flex-wrap: nowrap;
}
.qiun-title-dot-light {
  border-left: 10upx solid #0ea391;
  padding-left: 10upx;
  font-size: 32upx;
  color: #000000;
}
/* 通用样式 */
.qiun-charts {
  width: 750rpx;
  height: 500rpx;
  background-color: #ffffff;
}
.charts {
  width: 750rpx;
  height: 500rpx;
  background-color: #ffffff;
}
</style>