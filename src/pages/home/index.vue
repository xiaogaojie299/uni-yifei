<template>
  <view>
    <view class="header">
      <view class="my-box header-cont">
        <view class="list-item" v-for="(item,index) in list" :key="index">
          <img class="" :src="item.imgUrl" alt="" />
          <view class="" style="width:100rpx;">
            <view v-if="index==3" class="font-s-36">{{item.num || 0}}条</view>
            <view v-else class="font-s-36">{{item.num || 0}}kg</view>
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
                <view class="btn-groups">
                   <view @tap="selectBtn(index)" class="btn-item flex-ver-center" :class="{active:index==isActive}" v-for="(item,index) in btns" :key="index">{{item.title}}</view>
                </view>
                <!-- 统计报表 -->
                <view class="qiun-columns">
                  <view class="qiun-bg-white qiun-title-bar qiun-common-mt" >
                    <view class="qiun-title-dot-light">基本柱状图</view>
                  </view>
                  <view class="qiun-charts" >
                    <canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
                </view>
	</view>
            </view>
        </view>
    </view>
    <view class="footer"> </view>
  </view>
</template>
<script>
import { getMenu,getIndex } from "@/utils/api.js";
import uCharts from "../../compontens/u-charts/u-charts";
import {getAreaList,getHosList,getProvinceCity} from "@/utils/menuList.js"
var _self;
var canvaColumn = null;
export default {
  data() {
    return {
      list: [
        { imgUrl: require("@/static/images/collect_icon.png"),title:"今日收集",num:0},

        { imgUrl: require("@/static/images/out_store.png"),title:"今日入库",num:0},

        { imgUrl: require("@/static/images/put_store.png") ,title:"今日出库",num:0},

        { imgUrl: require("@/static/images/early_warn.png"),title:"未处理预警" ,num:0},

        { imgUrl: require("@/static/images/no_store.png"),title:"未入库",num:0},

        { imgUrl: require("@/static/images/is_store.png"),title:"未出库",num:0},
        
      ],
      btns: [
        { title: "今日" },
        { title: "月" },
        { title: "季度" },
        { title: "半年" },
        { title: "年" },
      ],
      isActive: 0, //选中
      cWidth: "",
      cHeight: "",
      pixelRatio: 1,
      serverData: "",
    };
  },
  methods: {
    selectBtn(index) {
      this.isActive = index;
    },

    getServerData() {
      let _self = this;
      uni.request({
        url: "https://unidemo.dcloud.net.cn/hello-uniapp-ucharts-data.json",
        data: {},
        success: function (res) {
          console.log(res.data.Column);
          //下面这个根据需要保存后台数据，我是为了模拟更新柱状图，所以存下来了
          _self.serverData = res.data.Column;
          let Column = { categories: [], series: [] };
          //这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
          Column.categories = res.data.Column.categories;
          //这里的series数据是后台做好的，如果您的数据没有和前面我注释掉的格式一样，请自行拼接数据
          Column.series = [res.data.Column.series[0]];
          console.log("Column==>", Column);
          _self.showColumn("canvasColumn", Column);
        },
        fail: () => {
          console.log("网络错误，小程序端请检查合法域名");
        },
      });
    },
    showColumn(canvasId, chartData) {
      let _self = this;
      canvaColumn = new uCharts({
        $this: _self,
        canvasId: canvasId,
        type: "column",
        legend: true,
        fontSize: 11,
        background: "#FFFFFF",
        pixelRatio: _self.pixelRatio,
        animation: true,
        categories: chartData.categories,
        series: chartData.series,
        xAxis: {
          disableGrid: true,
        },
        yAxis: {},
        dataLabel: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        extra: {
          column: {
            width:
              (_self.cWidth * _self.pixelRatio * 0.45) /
              chartData.categories.length,
          },
        },
      });
    },
    changeData() {
      let _self = this;
      canvaColumn.updateData({
        series: _self.serverData.ColumnB.series,
        categories: _self.serverData.ColumnB.categories,
      });
    },
      // 获取出入库记录
  async init(){
   let res =await getIndex();
   try {
     if(res.code==200){
      //  res.result
      let {todayCheckout,todayCollect,todayStore,totalNonCheckout,totalNonStore}=res.result
      this.list.forEach((item,index)=>{
        switch (index){
          case 0:
          item.num = todayCollect;    //今日收集
          break;
          case 1:
            item.num= todayStore;      //今日入库
            break;
          case 2:
             item.num= todayStore;     //未处理预警
             break
          case 4: 
          item.num = totalNonStore     //未出库
          break;
          case 5: 
          item.num = totalNonCheckout     //未入库
          break;
          default:
            item.num = 0
        }
      })
      console.log("this.list==",this.list);
     }
   } catch (error) {
     console.log(error)
   }
   console.log("res==>",res);
  },
  },
  async onLoad(option) {
    getAreaList();
    getHosList();
    getProvinceCity();
    let _self = this;
    //#ifdef MP-ALIPAY
    uni.getSystemInfo({
      success: function (res) {
        if (res.pixelRatio > 1) {
          //正常这里给2就行，如果pixelRatio=3性能会降低一点
          //_self.pixelRatio =res.pixelRatio;
          _self.pixelRatio = 2;
        }
      },
    });
    //#endif
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(500);
    this.getServerData();
  },

  onShow(){
    this.init()
  }
};
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
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