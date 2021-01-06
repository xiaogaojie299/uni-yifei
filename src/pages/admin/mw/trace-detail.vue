<template>
  <view>
    <view class="trace-detail" v-if="mode == 'inventory'">
      <view class="trace-detail__item" v-for="(item, index) in fieldList" :key="index">
        <view class="trace-detail__item__key">{{ item.label }}</view>
        <view class="trace-detail__item__value">{{ detail[item.key] }}</view>
      </view>
    </view>
    <view class="trace-detail" v-else-if="mode == 'checkout'">
      <view class="trace-detail__item" v-for="(item, index) in fieldListCheckout" :key="index">
        <view class="trace-detail__item__key">{{ item.label }}</view>
        <view class="trace-detail__item__value">{{ detail[item.key] }}</view>
      </view>
    </view>
    <view class="trace-detail" v-else-if="mode == 'restore'">
      <view class="trace-detail__item" v-for="(item, index) in fieldListRestore" :key="index">
        <view class="trace-detail__item__key">{{ item.label }}</view>
        <view class="trace-detail__item__value" v-if="item.key == 'status' || item.key == 'auditStatus'">{{ detail[item.key] }}</view>
      </view>
    </view>
    <view class="trace-detail" v-else-if="mode == 'supply'">
      <view class="trace-detail__item" v-for="(item, index) in fieldListSupply" :key="index">
        <view class="trace-detail__item__key">{{ item.label }}</view>
        <view :class="{'trace-detail__item__value': true, 'status': item.key == 'auditStatus' && detail.auditStatus == 1}">
          <block v-if="item.key == 'status'">
            {{ statusMap[detail[item.key]] }}
          </block>
          <block v-else-if="item.key == 'auditStatus'">
            {{ auditStatusMap[detail[item.key]] }}
          </block>
          <block v-else>
            {{ detail[item.key] }}
          </block>
          </view>
      </view>
    </view>
    
  </view>
</template>
<script>
	/**
	 * select 医废详情页
	 * @description 现用于多个，包含但不限于：入库详情，出库详情，收集记录，补录详情
	 * @property {String} mode 模式选择，"inventory"-入库，"checkout"-出库，"restore"-数据恢复，"supply"-医废补录
	 */
  
import { detailMedicalTrace, getMedicalTraceRecord } from "@/utils/api.js";
import Index from '../index.vue';
export default {
  components:{
    Index
  },
  data() {
    return {
      detail: {},
      statusMap: [
          '', '未入库', '已入库', '已出库'
      ],
      auditStatusMap: [
          '', '待审核', '已通过', '已拒绝'
      ],
      fieldList: [
        {
          key: 'createTime',
          label: '收集时间'
        },
        {
          key: 'code',
          label: '医废编号'
        },
        {
          key: 'hospitalName',
          label: '医院名称'
        },
        {
          key: 'departmentName',
          label: '科室'
        },
        {
          key: 'wasteTypeStr',
          label: '医废类型'
        },
        {
          key: 'weight',
          label: '重量(kg)'
        },
        {
          key: 'departmentUserName',
          label: '科室人员'
        },
        {
          key: 'creator',
          label: '收集人员'
        },
        {
          key: 'description',
          label: '备注'
        },
      ],
      // 出库
      fieldListCheckout: [
        {
          key: 'createTime',
          label: '出库时间'
        },
        {
          key: 'code',
          label: '医废编号'
        },
        {
          key: 'boxCode',
          label: '装箱编号'
        },
        {
          key: 'hospitalName',
          label: '医院名称'
        },
        {
          key: 'departmentName',
          label: '科室'
        },
        {
          key: 'wasteTypeStr',
          label: '医废类型'
        },
        {
          key: 'weight',
          label: '重量(kg)'
        },
        {
          key: 'checkoutUser',
          label: '出库人员'
        },
        {
          key: 'engineDriver',
          label: '运输人员'
        },
        {
          key: 'licensePlate',
          label: '车牌号'
        },
        {
          key: 'transitCompany',
          label: '运输单位'
        },
      ],
      // 补录
      fieldListSupply: [
        {
          key: 'auditStatus',
          label: '审核状态'
        },
        {
          key: 'supplyTime',
          label: '补录时间'
        },
        {
          key: 'createTime',
          label: '收集时间'
        },
        {
          key: 'code',
          label: '医废编号'
        },
        {
          key: 'hospitalName',
          label: '医院名称'
        },
        {
          key: 'departmentName',
          label: '科室'
        },
        {
          key: 'wasteTypeStr',
          label: '医废类型'
        },
        {
          key: 'weight',
          label: '重量(kg)'
        },
        {
          key: 'departmentUserName',
          label: '科室人员'
        },
        {
          key: 'creator',
          label: '收集人员'
        },
        {
          key: 'description',
          label: '备注'
        },
        {
          key: 'status',
          label: '医废状态'
        },
      ],
      // 数据恢复
      fieldListRestore: [
        {
          key: 'deleteTime',
          label: '删除时间'
        },
        {
          key: 'createTime',
          label: '收集时间'
        },
        {
          key: 'code',
          label: '医废编号'
        },
        {
          key: 'hospitalName',
          label: '医院名称'
        },
        {
          key: 'departmentName',
          label: '科室'
        },
        {
          key: 'wasteTypeStr',
          label: '医废类型'
        },
        {
          key: 'weight',
          label: '重量(kg)'
        },
        {
          key: 'departmentUserName',
          label: '科室人员'
        },
        {
          key: 'creator',
          label: '收集人员'
        },
        {
          key: 'description',
          label: '备注'
        },
        {
          key: 'status',
          label: '状态'
        },
      ]
    };
  },
  onLoad(option) {
    this.mode = option.mode || 'inventory';
    this.loadDetail(option.id);
  },
  methods: {
    loadDetail(id) {
      if (this.mode == 'checkout') {
        // 调的接口不一样
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
      } else {
        detailMedicalTrace({id}).then(res => {
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
  }
};
</script>
<style lang="scss" scoped>
.trace-detail {
  padding: 30rpx;
  box-sizing: border-box;
  &__item {
    padding: 15rpx 0;
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    color: #000;
    &__key {
      max-width: 200rpx;
    }
    &__value {
      max-width: 500rpx;
      font-weight: 500;
      &.status {
          color: #FFB42B;
      }
    }
  }
}
</style>