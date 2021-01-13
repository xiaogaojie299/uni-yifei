<template lang="">
    <view class="container">
        <view class="header">
            <!-- 选择区域 -->
            <view class="my-box pt-20">
                <view class="select-drop pl-20 pr-20"  @tap="show=true">
                    <text> {{selectArea.label||'选择区域'}} </text>
                </view>
                <!-- 选择器 -->
                <view class="select-active mt-30">
                    <!-- <u-subsection @change="changeMenu" active-color="#1539AF" inactive-color="#ffffff" :list="subsectionList" :current="current"></u-subsection> -->
                  <my-subsection :list="subsectionList" @changeMenu="changeMenu"></my-subsection>
                </view>
            </view>
        </view>
        <view class="main">
            
            <view class="my-box">

              <view class="flex list-header">
                <view v-for="(index) in tHeader" :key="index"  class="">
                {{index}}
                </view>
              </view>

              <view v-for="(item,index) in tableData.records" :key="index" class="flex list-body">
                  <view class="">
                    <img v-if="item.ranks==1" src="@/static/images/NO1.png" />
                    <img v-else-if="item.ranks==2" src="@/static/images/NO2.png" />
                    <img v-else-if="item.ranks==3" src="@/static/images/NO3.png" />
                    <text v-else>{{item.ranks}}</text>
                  </view>
                  <view class="nowrap-hidden">{{item.name}}</view>
                  <view class="">{{item.data}}</view>
              </view>

            </view>

        </view>
        <view class="footer">
            
        </view>
        <u-select v-model="show" mode="mutil-column-auto" :list="areaList" @confirm="confirm"></u-select>
    </view>
</template>
<script>
import areaDropDown from "@/compontens/my-drop-down/area-drop-down";
import {getRangeStatistics,getTodayRankStatistics,getYesterdayRangeStatistics} from "@/utils/api"
import mySubsection from "@/compontens/my-subsection/my-subsection"
export default {
  data() {
    return {
      show: false,
      areaList: [],
      selectArea: {},
      subsectionList: [
					{
						name: '今日排行'
					},
					{
						name: '昨日排行'
					}, 
					{
						name: '累计排行'
					}
        ],
	      current: 0,
        tHeader:[
          "排名",
          "医院",
          "手机重量(kg)"
        ],
        tableData:{},
        pageNo:1,
        pageSize:10,
        index:0     //默认显示今日，做分页
    };
  },
  components: {
    areaDropDown,
    mySubsection
  },
  created() {
    this.areaList = JSON.parse(uni.getStorageSync("area"));
  },
  onReachBottom(){
    // 页面触底
    this.pageNo++;
    this.subsectionList=[{name:"测试"}]
     switch(this.index){
          case 0: this.getRanktotal(getTodayRankStatistics)
          break;
          case 1:this.getRanktotal(getYesterdayRangeStatistics)
          break;
          default:
            this.getRanktotal(getRangeStatistics)
        }
  },
  methods: {
    confirm(e) {
      this.selectArea = e[e.length - 1];
      this.getRanktotal(getTodayRankStatistics);  //默认显示今日排行
    },
    init(){
      this.pageNo=1;
    },
    changeMenu(index){   // 改变横向菜单
        console.log("index==>",index);
        this.index = index;
        this.init();
        switch(index){
          case 0: this.getRanktotal(getTodayRankStatistics)
          break;
          case 1:this.getRanktotal(getYesterdayRangeStatistics)
          break;
          default:
            this.getRanktotal(getRangeStatistics)
        }
    },
    async getRanktotal(callback){
      let params={
        departmentId:this.selectArea.value,
        pageNo:this.pageNo,
        pageSize:this.pageSize
      };
      let {code,result,message}=await callback(params);
      if(code==200){
        this.tableData = result;
      }else{
        uni.showToast({
          title:message,
          icon:"none"
        })
      }
    }
  },
};
</script>
<style lang="scss" scoped>
/deep/ .u-subsection{
    height: 56rpx !important;
    background: #5B74C7 !important;
    border-radius: 28rpx !important;
}
/deep/ .u-item-text{
    font-size: 28rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
}
/deep/ .u-item-bg{
    width: 226rpx !important;
height: 44rpx !important;
background: #FFFFFF !important;
border-radius: 22rpx !important;
}
.header {
  height: 188rpx;
  background: $my-main-color;
  .select-drop {
    width: 220rpx;
    height: 44rpx;
    border-radius: 22rpx;
    background: #5b74c7;
    font-size: 28rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #ffffff;
  }
  .select-active{
      width: 100%;
    height: 56rpx;
    background: #5B74C7;
    border-radius: 28rpx;
  }
}
.main{
  .list-header,.list-body{
    view{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80rpx;
    }
    img{
      width: 44rpx;
      height: 52rpx;
    }
    view:nth-child(1){
      width: 142rpx;
    }
     view:nth-child(2){
      flex:1;
    }
     view:nth-child(3){
      width: 182rpx;
    }
  }
  .list-header{
      color: rgba(0, 0, 0, 0.4);
      font-size: 28rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
  }
  .list-body{
    color: rgba(0, 0, 0, 0.8) ;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
}
</style>