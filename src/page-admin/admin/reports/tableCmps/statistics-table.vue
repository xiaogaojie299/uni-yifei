<template>
  <view class="">
    <view class="table">
      <scroll-view class="scroll-view_H" scroll-x="true">
        <view class="table-box">
          <view class="table-box-item">
            <view class="main-theader">
              <view class="theader">
                <view class="th my-border">
                  <view class="qy-name"> 科室名称 </view>
                </view>
                <!-- 需要合并单元格的 -->
                <view
                  class="my-border th-col-box"
                  v-for="(item, index) in tableData.legend"
                  :key="index"
                >
                  <view class="test-col my-border">
                    <view class="test-col-one">
                      {{ item }}
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
              </view>
            </view>

            <!-- main -->
            <view class="main-tbody">
              <view
                class="tbody"
                v-for="(item, index) in tableData.list"
                :key="index"
              >
                <!-- 日期时间 -->
                <view class="th my-border">
                  <view class="qy-name">
                    {{ item.name }}
                  </view>
                </view>
                <!-- 分隔单元格 -->
                <view
                  class="cell my-border"
                  v-for="(it, i) in item.data"
                  :key="i"
                >
                  <view class="">
                    {{ it }}
                  </view>
                </view>
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
      cellList: [
        {
          title: "医疗机构人员签字",
        },
        {
          title: "运输人员签字",
        },
        {
          title: "交接时间",
        },
      ],
    };
  },
  props: {
    tableData: {
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  methods: {
  },
  created() {
  },
};
</script>
<style lang="scss" scoped>
.my-border {
  border: 0.5rpx solid #eaeaea;
}
.table {
  width: 100%;
  view {
    display: inline-block;
  }
  .scroll-view_H {
    white-space: nowrap;
    min-height: 280rpx;
    // display: flex;
    // flex-direction: column;
    // justify-content: start;
    // align-items: center;
  }
  .table-box {
    min-height: 1000rpx;
    .table-box-item {
      display: flex;
      flex-direction: column;
      .theader {
        min-width: 100vw;
        height: 120rpx;
        display: flex;
        color: #fff;
        font-size: 24rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        view {
          background: $my-main-color;
        }
        .th {
          width: 240rpx;
          height: 100%;
          .qy-name {
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
          .test-col {
            display: flex;
            flex-direction: column;
            width: 300rpx;
            height: 100%;
            .test-col-one,
            .test-col-iline {
              height: 50%;
            }
            .test-col-one {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .test-col-iline {
              view {
                width: 50%;
                height: 100%;
              }
              text {
                height: 100%;
              }
            }
          }
          .th-col-row1 {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .th-col-row2 {
            display: flex;
            flex-wrap: nowrap;
            view {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 50%;
              height: 100%;
            }
          }
        }
        .test-box {
          // height: 92%;
          height: 100rpx;
          width: 400rpx;
        }
      }
      .main-tbody {
        display: flex;
        flex-direction: column;
        .tbody:nth-of-type(2n) {
          background: #f7f9ff;
          border: 0;
        }
        .tbody {
          min-width: 100vw;
          height: 60rpx;

          font-size: 24rpx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;
          .th {
            width: 240rpx;
            height: 60rpx;
            .qy-name {
              width: 240rpx;
              height: 60rpx;
              text-align: center;
              line-height: 60rpx;
            }
          }
          .cell {
            width: 150rpx;
            height: 60rpx;
            text-align: center;
            line-height: 60rpx;
          }
        }
      }
    }
  }
}
</style>
