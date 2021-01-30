<template>
    <view class="warning-custom">
      <u-sticky>
        <view class="filter-box">
            <view class="filter-tools">
                <mw-select :default-value="mwSelectDefaultValue" :options="options" @confirm="searchConfirm"/>
            </view>
        </view>
      </u-sticky>
        <view class="warning-custom__container">
            <view class="warning-custom__box" v-for="(item, index) in list" :key="index">
                <view class="warning-custom__box__data">
                    <view class="warning-custom__box__data__item">
                        医院名称：<text style="font-weight: 500;">{{ item.customHospitalName }}</text>
                    </view>
                    <view class="warning-custom__box__data__item" v-if="type == 1">
                        科室：<text style="font-weight: 500;">{{ item.customOfficeName }}</text>
                    </view>
                    <view class="warning-custom__box__data__item" v-if="type == 4">
                        类型：<text style="font-weight: 500;">{{ item.wasteTypeName }}</text>
                    </view>
                    <view class="warning-custom__box__data__item">
                        超时时长(天)：<text style="font-weight: 500;">{{ item.customValue }}</text>
                    </view>
                </view>
                <view class="warning-custom__box__action">
                    <u-icon name="edit-pen" size="40" color="#1539AF" @click="edit(item)" />
                    <u-icon name="trash" size="40" color="#FFB42B" @click="remove(item, index)"/>
                </view>
            </view>
        </view>
        <view class="button-container">
            <view class="button" @click="add()">新增</view>
        </view>
    </view>
</template>
<script>
import { listWarningConfigItem, removeWarningConfigItem } from '@/utils/api';
import mwSelectMixin from '@/mixins/mw-select.js';
import mwSelect from '@/compontens/mw-select';
export default {
  mixins: [ mwSelectMixin ],
  components:{
      mwSelect
  },
  computed: {
      disabled() {
          return !this.$util.checkPermission('warning:setting:type' + this.type);
      }
  },
  onLoad(option) {
        // 设置默认医院
    let { departmentId, departmentName } = this.$util.getMyDepartment();
    // let { departmentId } = JSON.parse(uni.getStorageSync("userInfo"));
    this.hospitalId = departmentId;
      this.type = option.type;
      this.reload();
  },
  onShow() {
      if(uni.getStorageSync('willRefresh')) {
          this.reload(); 
          uni.removeStorageSync('willRefresh');
      }
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
        options: {
          cascade: true,
        },

        hospitalShow: false, // 医院选择显示
        hospitalIndex: [], // 已选中的医院索引
        hospitalLabel: '', // 医院选择结果的文本
        hospitalId: '', // 医院ID
        cascadeData: {},
      }
  },
  methods: {
      searchConfirm(e) {
        // 医院ID
        this.hospitalId = e.cascade;
        this.reload();
      },
      showCascade() {
        this.$toTree(Object.assign(this.cascadeData, {
            checkOnlyLeaf: true
        }));
      },
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
      edit(item) {
          // 存到本地，因为没有单独的接口拿数据哦
          uni.setStorageSync('cache:warning-setting:custom', item);
          uni.navigateTo({
              url: '/pages-mw/warning/custom-edit?type=' + this.type
          });
      },
      add() {
          uni.removeStorageSync('cache:warning-setting:custom');
          uni.navigateTo({
              url: '/pages-mw/warning/custom-edit?type=' + this.type
          });
      },
      remove(item, index) {
        let _this = this;
        uni.showModal({
            title: '提示',
            content: '您确认要删除该条数据吗？',
            success: function (res) {
                if (res.confirm) {
                    removeWarningConfigItem({
                        id: item.id
                    }).then(resp => {
                        if (resp.code == 200) {
                            uni.showToast({
                                title: '删除成功',
                                icon: 'none'
                            });
                            _this.list.splice(index, 1);
                        }
                    });
                }
            }
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
.warning-custom {
    .filter-box {
        background: #1539AF;
        height: 100rpx;
        width: 100%;
        .filter-tools {

        }
    }
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
            ::v-deep .u-icon {

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
::v-deep .u-field {
    background: #fff;
    height: 100rpx;
    display: flex;
    align-items: center;
    width: 100%;
}
::v-deep .u-field-inner {
    width: 100%;
}
</style>