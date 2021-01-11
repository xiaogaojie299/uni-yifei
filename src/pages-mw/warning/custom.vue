<template>
    <view class="warning-custom">
        <u-sticky>
            <u-field
                label="选择医院"
                placeholder="请选择医院"
                v-model="hospitalLabel"
                disabled
                @click="hospitalShow = true"
            >
                <view class="button-search" slot="right" @click="reload()">查询</view>
            </u-field>
        </u-sticky>
        <view class="warning-custom__container">
            <view class="warning-custom__box" v-for="(item, index) in list" :key="index">
                <view class="warning-custom__box__data">
                    <view class="warning-custom__box__data__item">
                        医院名称：<text style="font-weight: 500;">{{ item.customHospitalName }}</text>
                    </view>
                    <view class="warning-custom__box__data__item">
                        科室：<text style="font-weight: 500;">{{ item.customOfficeName }}</text>
                    </view>
                    <view class="warning-custom__box__data__item">
                        超时时长(天)：<text style="font-weight: 500;">{{ item.customValue }}</text>
                    </view>
                </view>
                <view class="warning-custom__box__action">
                    <u-icon name="edit-pen" size="40" color="#1539AF" @click="edit(item)" />
                    <u-icon name="trash" size="40" color="#FFB42B" />
                </view>
            </view>
        </view>
        <view class="button-container">
            <view class="button" @click="add()">新增配置</view>
        </view>
        <hospital-select title="选择医院" v-model="hospitalShow" @confirm="hospitalCallback" :default-value="hospitalIndex"/>
    </view>
</template>
<script>
import HospitalSelect from '@/compontens/hospital-select.vue';
import { listWarningConfigItem } from '@/utils/api';
export default {
  components:{
      HospitalSelect
  },
  onLoad(option) {
      this.type = option.type;
      this.reload();
  },
  onPullDownRefresh() {
    this.reload();
  },
  onReachBottom() {
    this.next();
  },
  data() {
      return {
        type: '', // 配置的类型ID
        label: '', // 文本文案
        page: 1, // 页码
        pagesize: 10, // 每页大小
        list: [],
        total: 0,
        pages: 0,

        hospitalShow: false, // 医院选择显示
        hospitalIndex: [], // 已选中的医院索引
        hospitalLabel: '', // 医院选择结果的文本
        hospitalId: '', // 医院ID
      }
  },
  watch: {
  },
  methods: {
      reload() {
        this.pageNo = 1;
        this.pageSize = 10;
        this.list = [];
        this.total = 0;
        this.pages = 0;
        this.paginate();
      },
      // 加载下一页
      next() {
        if (this.pageNo >= this.pages) {
          uni.showToast({
            title: '没有更多了',
            icon: 'none'
          });
          return ;
        }

        this.pageNo++;
        this.paginate();
      },
      paginate() {
          this.loading = true;
          listWarningConfigItem({
              type: this.type,
              pageNo: this.page,
              pageSize: this.pagesize,
              departmentId: this.hospitalId
          }).then(resp => {
              console.log(resp);
            if (resp.code == 200) {
              this.list = [...this.list, ...resp.result.records];
              this.total = resp.result.total;
              this.pages = resp.result.pages;
            }
          }).catch(err => {}).finally(e => {
            this.loading = false;
            uni.stopPullDownRefresh();
          });
      },
      hospitalCallback(e) {
          if (e.e.length > 0) {
              let hospital = e.e[e.e.length - 1];
              this.hospitalLabel = hospital.label;
              this.hospitalId = hospital.value;
              console.log(this.hospitalId, hospital);
          }
      },
      edit(item) {
          // 存到本地，因为没有单独的接口拿数据哦
          uni.setStorageSync('cache:warning-setting:custom', item);
          uni.navigateTo({
              url: '/pages-mw/warning/custom-edit'
          });
      },
      add() {
          uni.removeStorageSync('cache:warning-setting:custom');
          uni.navigateTo({
              url: '/pages-mw/warning/custom-edit'
          });
      }
  }
}
</script>
<style lang="scss" scoped>
page {
    background: #F3F5F7;
    min-height: 100vh;
}
.warning-custom__container {
    margin-bottom: 100rpx;
    .warning-custom__box {
        margin-top: 20rpx;
        background: #fff;
        padding: 15rpx 28rpx;
        display: flex;
        justify-content: space-between;
        &__data {
            width: 500rpx;
            &__item {
                padding: 8rpx 0;
            }
        }
        &__action {
            width: 150rpx;
            display: flex;
            align-items: center;
            justify-content: space-around;
            /deep/ .u-icon {

            }
        }
    }
}
.button-search {
    margin: 0 6rpx;
    @include flex-center;
    padding: 16rpx 32rpx;
    height: 60rpx;
    border-radius: 30rpx ;
    min-width: 160rpx;
    font-size: 24rpx;
    background: rgba(255,255,255,.2);
    border: 1px solid $my-main-color;
    color: $my-main-color;
}

.button-container {
    position: fixed;
    height: 100rpx;
    width: 100%;
    bottom: 0;
    .button {
        width: 100%;
        height: 100%;
        background: $my-main-color;
        color: #fff;
        @include flex-center;
    }
}
/deep/ .u-field {
    background: #fff;
    height: 100rpx;
    display: flex;
    align-items: center;
    width: 100%;
}
/deep/ .u-field-inner {
    width: 100%;
}
</style>