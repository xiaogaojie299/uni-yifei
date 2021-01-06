<template>
  <view class="container">
    <u-time-line>
      <u-time-line-item nodeTop="2">
        <template v-slot:node>
          <view class="u-node">
            <view class="u-dot" />
          </view>
        </template>
        <template v-slot:content>
          <view>
            <view class="u-order-title">收集</view>
            <view class="u-order-desc">
                <view>收集时间：{{ detail.createTime }}</view>
                <view>医废编号：{{ detail.code }}</view>
                <view>医院名称：{{ detail.hospitalName }}</view>
                <view>科室名称：{{ detail.departmentName }}</view>
                <view>医废类型：{{ detail.wasteTypeStr }}</view>
                <view>重量(kg)：{{ detail.weight }}</view>
                <view>科室人员：{{ detail.departmentUserName }}</view>
                <view>收集人员：{{ detail.creator }}</view>
                <view>备注：{{ detail.description }}</view>
            </view>
          </view>
        </template>
      </u-time-line-item>
      <u-time-line-item>
        <template v-slot:node>
          <view class="u-node">
            <view class="u-dot" />
          </view>
        </template>
        <template v-slot:content>
          <view>
            <view class="u-order-title">入库</view>
            <view class="u-order-desc">
                <view>入库时间：{{ detail.storeTime }}</view>
                <view>入库人：{{ detail.storeUser }}</view>
                <view>装箱编号：{{ detail.boxCode }}</view>
            </view>
          </view>
        </template>
      </u-time-line-item>
      <u-time-line-item>
        <template v-slot:node>
          <view class="u-node">
            <view class="u-dot" />
          </view>
        </template>
        <template v-slot:content>
          <view>
            <view class="u-order-title">出库</view>
            <view class="u-order-desc">
                <view>出库时间：{{ detail.checkoutTime }}</view>
                <view>出库人：{{ detail.checkoutUser }}</view>
                <view>运输人员：{{ detail.engineDriver }}</view>
                <view>车牌号：{{ detail.licensePlate }}</view>
                <view>运输单位：{{ detail.transitCompany }}</view>
            </view>
          </view>
        </template>
      </u-time-line-item>
    </u-time-line>
  </view>
</template>
<script>
import { getMedicalTraceRecord } from "@/utils/api.js";
export default {
  components:{
  },
  data() {
    return {
      detail: {}
    };
  },
  onLoad(option) {
    this.loadDetail(option.id);
  },
  methods: {
    loadDetail(id) {
      getMedicalTraceRecord({id}).then(res => {
        if (res.code == 200) {
          this.detail = res.result;
        } else {
          uni.showToast({
            title: '加载数据异常',
            icon: 'none'
          })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 50rpx;
  box-sizing: border-box;
}
.u-dot {
  background: $my-main-color;
  height: 40rpx;
  width: 40rpx;
  border-radius: 50%;
  border: 8rpx solid #D1DAFE;
}
.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		// background: #d0d0d0;
	}
	
	.u-order-title {
		color: #333333;
		font-weight: bold;
    font-size: 32rpx;
    margin-bottom: 15rpx;
	}
	
	.u-order-desc {
		color: #000;
    font-size: 28rpx;
    line-height: 50rpx;
		margin-bottom: 6rpx;
	}
	
	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}
</style>