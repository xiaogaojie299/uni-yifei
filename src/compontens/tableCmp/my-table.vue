<template>
  <view class="">
    
    <button @click="getTableList">按钮测试获取数据</button>

    <view class="table">
      <scroll-view class="scroll-view_H" scroll-x="true">
        <view class="theader">
          <view class="th my-border">
             <view class="qy-name">
               日期
             </view> 
          </view>
          <!-- 需要合并单元格的 -->
          <view class="my-border" v-for="(item,index) in tableTitle" :key="index">
            <view class="test-col my-border">
                <view class="test-col-one">
                   {{item}}
                </view>
                <view class="test-col-iline">
                  <view class="test-col-iline-num my-border">
                   <text class="flex-ver-center"> 数量 </text>
                  </view>
                  <view class="my-border">
                   <text class="flex-ver-center">重量(kg)</text>
                  </view>
                </view>
            </view>
          </view>


           <view class="th my-border">
             <view class="qy-name">
               医疗机构人员签字
             </view> 
          </view>

          <view class="th my-border">
             <view class="qy-name">
               运输人员签字
             </view> 
          </view>

          <view class="th my-border">
             <view class="qy-name">
               交接时间
             </view> 
          </view>

        </view>
        <!-- main -->
        <view class="main-tbody">
          <view class="tbody my-border" v-for="(item,index) in tableData" :key="index">
            <!-- 日期时间 -->
              <view class="th my-border">
              <view class="qy-name">
                  {{item.date}}
              </view> 
            </view>
            <!-- 分隔单元格 -->
            <view class="cell my-border" v-for="(it,i) in item.data" :key="i">
              <view class="">
                {{it}}
              </view>
            </view>
            <!-- 医疗机构人员签字 -->
            <view class="th my-border">
              <view class="qy-name">
                {{item.departmentUserName}}
              </view> 
            </view>
            <!-- 运输人员签字 -->
            <view class="th my-border">
              <view class="qy-name">
                {{item.engineDriver}}
              </view> 
            </view>
            <!-- 交接时间 -->
            <view class="th my-border">
              <view class="qy-name">
                {{item.checkoutTime}}
              </view> 
            </view>
          </view>
        </view>

      </scroll-view>
    </view>
  </view>
</template>
<script>
import {
  getMyHospitalCascadeList,
  listSelect,
  getTransformList,
} from "@/utils/api.js";
export default {
  data() {
    return {
      tableTitle: "",
      tableData: [],
      cellList:[{
        title:"医疗机构人员签字"
      },
      {
        title:"运输人员签字"
      },
      {
        title:"交接时间"
      },
      ]
    };
  },
  methods: {
    async getTableList() {
      /* 
      let params={
        departmentId:this.options1[this.value1].realValue, //医院区域ID
        transitCompany:this.value2, //运输处置中心
        startTime:this.timeStar,
        endTime:this.timerEnd
      }
      */
      let params = {
        departmentId: 44, //医院区域ID
        transitCompany: "处置中心", //运输处置中心
        startTime: "2020-12-01 00:00:00",
        endTime: "2020-12-31 23:59:59",
      };
      try {
        let { code, result, message } = await getTransformList(params);
        console.log(result);
        this.tableTitle = result.legend; //表头菜单
        this.tableData = result.list; //表格中的数据
      } catch (error) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.my-border{
  border:0.5rpx solid #EAEAEA
}
.table {
  width: 100%;
  view {
    display: inline-block;
  }
  .scroll-view_H {
    white-space: nowrap;
    min-height: 280rpx;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
  .theader {
    min-width: 100vw;
    height: 120rpx;
    display: flex;
    color: #fff;
    font-size: 24rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    view{
      background: $my-main-color;
    }
    .th {
      width: 240rpx;
      height:100%;
      .qy-name{
        width: 240rpx;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .th-col-box {
      width: 300rpx;
      height: 100%;
      border: 1px solid white;
      .test-col{
        display: flex;
        flex-direction: column;
        width: 300rpx;
        height: 100%;
         .test-col-one,.test-col-iline{
          height: 50%;
        }
        .test-col-one{
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .test-col-iline{
          view{
            width: 50%;
            height: 100%;
          }
          text{
            height: 100%;
          }
        }
      }
      .th-col-row1{
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .th-col-row2{
        display: flex;
        flex-wrap: nowrap;
        view{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50%;
          height: 100%;
        }
      }
    }
    .test-box{
      // height: 92%;
      height: 100rpx;
      width: 400rpx;
    }
  }
  .main-tbody{
    display: flex;
    flex-direction: column;
    .tbody:nth-of-type(2n){
      background: #F7F9FF;
      border: 0;
    }
  .tbody{
    min-width: 100vw;
    height: 60rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #000000 ;
    .th {
      width: 240rpx;
      height:60rpx;
     .qy-name{
        width: 240rpx;
        height:60rpx;
        text-align: center;
        line-height: 60rpx;
      }
    }
    .cell{
        width: 150rpx;
        height: 60rpx;
        text-align: center;
        line-height: 60rpx;
        
    // view{
    //   width: 50%;
    //   height: 100%;
    //   text-align: center;
    //             line-height: 60rpx;
    //   }
    }
  }
  }
}
</style>
