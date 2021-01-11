<template>
  <view>
    
    <view class="trace-detail">
      <view class="trace-detail__item" v-for="(item, index) in fieldList" :key="index">
        <view class="trace-detail__item__key">{{ item.label }}</view>
        <view class="trace-detail__item__value">{{ detail[item.key] }}</view>
      </view>
    </view>
    <view class="trace-detail__footer" v-if="canRemove || canEdit">
      <block>
        <view class="trace-detail__footer__btn trace-detail__footer__cancel" @click="remove()" v-if="canRemove">
          删除
        </view>
        <view class="trace-detail__footer__btn trace-detail__footer__confirm" @click="edit()" v-if="canEdit">
          编辑
        </view>
      </block>
    </view>
  </view>
</template>
<script>
import { deleteTransitConfig } from "@/utils/api.js";
export default {
  components:{
  },
  data() {
    return {
      detail: {},
      fieldList: [
        {
          key: 'hospitalName',
          label: '医院名称'
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
        {
          key: 'wasteType',
          label: '准运类型'
        },
        {
          key: 'area',
          label: '区域'
        }
      ],
    };
  },
  onLoad(option) {
    this.loadDetail(option.id);
  },
  computed: {
    canRemove() {
      return this.$util.checkPermission('outbound:setting:delete');
    },
    canEdit() {
      return this.$util.checkPermission('outbound:setting:edit')
    },
  },
  methods: {
    edit() {
      uni.navigateTo({
          url: '/pages-mw/mw/outbound-setting-edit'
      })
    },
    loadDetail(id) {
      // 调的接口不一样
      let detail = uni.getStorageSync('cache:outbound:detail');
      if (!detail) {
        uni.showToast({
          title: '没有获取到详情信息',
          icon: 'none'
        });
        uni.navigateBack();
        return ;
      }
      this.detail = detail;
    },
    remove() {
        let _this = this;
        uni.showModal({
            title: '提示',
            content: '您确认要删除吗？',
            success: function (res) {
                if (res.confirm) {
                    // 点击删除
                    deleteTransitConfig({
                        id: _this.detail.id
                    }).then(resp => {
                        if (resp.code == 200) {
                            uni.showToast({
                                title: '删除成功',
                                icon: 'none'
                            });
                        }
                    });
                }
            }
        });
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
  &__footer {
    width: 100%;
    position: fixed;
    bottom: 0;
		height: 180rpx;
		box-sizing: border-box;
		padding: 30rpx 0 60rpx 0;
		display: flex;
		justify-content: center;
		&__confirm {
			border-radius: 0 40rpx 40rpx 0;
			background: $my-main-color;
		}
		&__restore {
			border-radius: 40rpx;
      min-width: 400rpx;
			background: $my-main-color;
		}
		&__cancel {
			border-radius: 40rpx 0px 0px 40rpx;
			background: $my-cancel-color;
			color: #000 !important;
		}
		&__btn {
			width: 200rpx;
			height: 80rpx;
			display: flex;
			color: #fff;
			justify-content: center;
			align-items: center;
		}
  }
}
</style>