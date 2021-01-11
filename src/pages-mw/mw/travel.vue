<template>
    <view class="page-travel">
      <u-sticky>
        <view class="filter-box">
            <view class="filter-tools">
                <mw-select :options="options" @confirm="searchConfirm"/>
            </view>
        </view>
      </u-sticky>
      <view class="list-container">
          <view class="travel-detail">
              <view class="travel-detail__title">
                  收集人员：张东东
              </view>
              <view class="travel-detail__content">
                  <view class="travel-detail__content__list">
                    <view class="travel-detail__content__list__item" v-for="(item, index) in [0,1,2,3]" :key="index">
                        <view class="travel-detail__content__list__item__icon__box">
                            <view class="travel-detail__content__list__item__icon flex-ver-center">{{index}}</view>
                        </view>
                        <view class="travel-detail__content__list__item__name">科室{{index}}</view>
                        <view class="travel-detail__content__list__item__time">2020-10-24 14:00:00</view>
                    </view>
                  </view>
                  <view class="travel-detail__content__list">
                    <view class="travel-detail__content__list__item" v-for="(item, index) in [0,1,2,3]" :key="index">
                        <view class="travel-detail__content__list__item__icon__box">
                            <view class="travel-detail__content__list__item__icon flex-ver-center">{{index}}</view>
                        </view>
                        <view class="travel-detail__content__list__item__name">科室{{index}}</view>
                        <view class="travel-detail__content__list__item__time">2020-10-24 14:00:00</view>
                    </view>
                  </view>
              </view>
          </view>
      </view>
    </view>
</template>
<script>
import mwSelect from '@/compontens/mw-select';
export default {
    components: {
      mwSelect  
    },
    data() {
        return {
            options: {
                cascade: true,
                timestampSelect: true
            },
        }
    },
    methods: {
        searchConfirm() {
            
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

                    &:nth-child(odd) {
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
                    }

                    &:nth-child(even) {
                      .travel-detail__content__list__item:last-child::after {
                        position: absolute;
                        content: "";
                        top: 0;
                        left: calc(50% - 1rpx);
                        background: linear-gradient(to bottom,  transparent 6rpx, transparent, #1A9AFF,#1A9AFF 6rpx);
                        background-size: 100% 12rpx;
                        width: 2rpx;
                        height: 70rpx;
                      }
                    }

              }
          }
      }
    }
}
</style>