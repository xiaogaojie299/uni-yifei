<template>
    <view class="page-travel">
      <u-sticky>
        <view class="filter-box">
            <view class="filter-tools">
                <mw-select :default-value="mwSelectDefaultValue" :options="options" @confirm="searchConfirm"/>
            </view>
        </view>
      </u-sticky>
      <view class="list-container">
          <s-loading v-show="loading" />
          <view class="travel-detail" v-for="(item, index) in list" :key="index">
              <view class="travel-detail__title">
                  收集人员：{{ item.creator }}
              </view>
              <view class="travel-detail__content">
                  <view class="travel-detail__content__list" v-for="(detail, dIndex) in item.showDetailList" :key="dIndex">
                    <view class="travel-detail__content__list__item" v-for="(detailItem, dIIndex) in detail" :key="dIIndex">
                        <view class="travel-detail__content__list__item__icon__box">
                            <view class="travel-detail__content__list__item__icon flex-ver-center">{{(dIndex * 4) + dIIndex + 1}}</view>
                        </view>
                        <view class="travel-detail__content__list__item__name">{{ detailItem.departmentName }}</view>
                        <view class="travel-detail__content__list__item__time">{{ detailItem.createTime }}</view>
                    </view>
                  </view>
              </view>
          </view> 
      </view>
    </view>
</template>
<script>
import mwSelect from '@/compontens/mw-select';
import sLoading from '@/compontens/s-loading';
import { collectTrajectory } from '@/utils/api';
import mwSelectMixin from '@/mixins/mw-select.js';
export default {
  mixins: [ mwSelectMixin ],
    components: {
      mwSelect, sLoading
    },
    data() {
        return {
            loading: false,
            options: {
                cascade: true,
                timestampSelect: true
            },
            list: [],
            total: 0,
            pageNo: 1,
            pageSize: 10,
            pages: 0,
            hospitalId: 62,
            startTime: '',
            endTime: ''
        }
    },
    mounted() {
        // this.reload();
    },
    onPullDownRefresh() {
        this.reload();
    },
    onReachBottom() {
        this.next();
    },
    methods: {
        searchConfirm(e) {
            console.log(e);
            if (e.cascade && e.timestampSelectValue) {
                this.hospitalId = e.cascade;
                this.startTime = e.timestampSelectValue + ' 00:00:00';
                this.endTime = this.$u.timeFormat(new Date(e.timestampSelectValue).getTime() / 1000 + 86400, 'yyyy-mm-dd') + ' 00:00:00';
                this.reload();
            }
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
            collectTrajectory({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                hospitalId: this.hospitalId,
                startTime: this.startTime,
                endTime: this.endTime
            }).then(resp => {
                if (resp.code == 200) {
                    let list = resp.result.records;
                    // 倒序排列
                    list = list.map((item, index) => {
                        // 把数组倒序排列后，处理成4个元素为一组的数组列表。
                        item.showDetailList = this.$util.chunk(item.detailList.reverse(), 4);
                        return item;
                    });
                    this.list = [...this.list, ...list];
                    this.total = resp.result.total;
                    this.pages = resp.result.pages;
                }
            }).finally(e => {
                this.loading = false;
                uni.stopPullDownRefresh();
            });
        }
    }
}
</script>

<style lang="scss" scoped>
page {
  overflow: hidden;
}
.page-travel {
    .filter-box {
        background: #1539AF;
        height: 100rpx;
        width: 100%;
        .filter-search {
            margin: 0rpx 28rpx;
            height: 80rpx;
        }
        .filter-tools {

        }
    }
    .list-container {
        min-height: 100vh;
        margin-bottom: 100rpx;
        // height: calc(100vh - 280rpx);
        background: #F3F5F7;
        .travel-detail {
            &__title {
                height: 60rpx;
                line-height: 60rpx;
                background: #f3f3f3;
                text-align: center;
                font-size: 28rpx;
            }
            &__content {
                background: #fff;
                box-sizing: border-box;
                padding: 20rpx 28rpx;
                &__list {
                    //   height: 250rpx;
                    //   padding: 50rpx 0 20rpx 0;
                    box-sizing: border-box;
                    display: flex;
                    &__item {
                        display: flex;
                        flex-direction: column;
                        min-width: 25%;
                        max-width: 25%;
                        justify-content: center;
                        align-items: center;
                        &__icon__box {
                            height: 140rpx;
                            display: flex;
                            // align-items: center;
                            padding-top: 70rpx;
                        }
                        &__icon {
                            background: $my-main-color;
                            height: 70rpx;
                            width: 70rpx;
                            line-height: 70rpx;
                            border-radius: 50%;
                            border: 10rpx solid #D1DAFE;
                            color: #fff;
                            text-align: center;
                        }
                        &__name {
                            font-weight: 500;
                            font-size: 32rpx;
                        }
                        &__time {
                            font-size: 24rpx;
                            text-align: center;
                            color: rgba(0,0,0,.4);
                        }

                        position: relative;
                        &:not(:first-of-type)::before {
                            position: absolute;
                            content: "";
                            top: 105rpx;
                            right: 100%;
                            background: linear-gradient(to left, transparent 6rpx, transparent, #1A9AFF,#1A9AFF 6rpx);
                            background-size: 12rpx 100%;
                            height: 2rpx;
                            width: calc(50% - 35rpx);
                        }
                        &:not(:last-of-type)::after {
                            position: absolute;
                            content: "";
                            top: 105rpx;
                            left: 100%;
                            background: linear-gradient(to right, transparent 6rpx, transparent, #1A9AFF,#1A9AFF 6rpx,);
                            background-size: 12rpx 100%;
                            height: 2rpx;
                            width: calc(50% - 35rpx);
                        }
                    }

                    &:first-child {
                        .travel-detail__content__list__item__icon__box {
                            height: 100rpx;
                            padding-top: 30rpx;
                        }
                        .travel-detail__content__list__item::before {
                            top: 65rpx;
                        }
                        .travel-detail__content__list__item::after {
                            top: 65rpx;
                        }
                        .travel-detail__content__list__item:first-child::before {
                            height: 0 !important;
                        }
                    }

                    .travel-detail__content__list__item:first-child::before {
                        position: absolute;
                        content: "";
                        top: 0;
                        left: calc(50% - 1rpx);
                        background: linear-gradient(to bottom,  transparent 6rpx, transparent, #1A9AFF,#1A9AFF 6rpx);
                        background-size: 100% 12rpx;
                        width: 2rpx;
                        height: 70rpx;
                    }

                    &:nth-child(even) {
                        flex-direction: row-reverse;
                        .travel-detail__content__list__item:not(:first-of-type)::before {
                            position: absolute;
                            content: "";
                            top: 105rpx;
                            right: 0;
                            background: linear-gradient(to right, transparent 6rpx, transparent, #1A9AFF,#1A9AFF 6rpx);
                            background-size: 12rpx 100%;
                            height: 2rpx;
                            width: calc(50% - 35rpx);
                        }
                        .travel-detail__content__list__item:not(:last-of-type)::after {
                            position: absolute;
                            content: "";
                            top: 105rpx;
                            left: 0;
                            background: linear-gradient(to left, transparent 6rpx, transparent, #1A9AFF,#1A9AFF 6rpx,);
                            background-size: 12rpx 100%;
                            height: 2rpx;
                            width: calc(50% - 35rpx);
                        }
                    }

              }
          }
      }
    }
}
</style>