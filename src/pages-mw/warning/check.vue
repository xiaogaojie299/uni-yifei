<template>
  <view class="warning-check">
      <scroll-view scroll-y class="warning-check__container" :style="{height: 'calc(100vh - ' + bottomButtonsHeight + 'rpx)'}">
        <view class="warning-check__container__box" v-for="(item, index) in list" :key="index">
            <view class="warning-check__container__box__item">
                <view class="warning-check__container__box__item__field warning-check__container__box__item__field__creator">
                    {{ item.creator }}
                </view>
                <view class="warning-check__container__box__item__field warning-check__container__box__item__field__time">
                    {{ item.createTime }}
                </view>
            </view>
            <view class="warning-check__container__box__item">
                <view class="warning-check__container__box__item__field warning-check__container__box__item__field__status" :style="{color: statusColorMap[item.status]}">
                    {{ statusMap[item.status] }}
                </view>
                <view class="warning-check__container__box__item__field warning-check__container__box__item__field__content">
                    {{ item.content }}
                </view>
            </view>
        </view>
        <view class="warning-check__container__textarea" v-if="showFooter">
            <u-input v-model="replyText" type="textarea" placeholder="填写处理意见..." class="warning-check__container__textarea__input" :custom-style="{padding: '28rpx 22rpx'}" :clearable="false" :height="220"/>
        </view>
      </scroll-view>
    <view class="warning-check__footer" v-if="showFooter">
        <block v-if="type == 2">
            <view class="warning-check__footer__line">
                <view v-if="canRefuse" :class="{'warning-check__footer__btn': true, 'warning-check__footer__cancel': true, 'warning-check__footer__disabled': refuseLoading}" @click="handle(4, 'refuseLoading')">
                    <u-loading v-show="refuseLoading" /> 驳回
                </view>
                <view v-if="canAccept" :class="{'warning-check__footer__btn': true, 'warning-check__footer__confirm': true, 'warning-check__footer__disabled': acceptLoading}" @click="handle(3, 'acceptLoading')">
                    <u-loading v-show="acceptLoading" /> 通过
                </view>
            </view>
        </block>
        <block v-else>
            <view class="warning-check__footer__line" v-if="canSubmit">
                <view :class="{'warning-check__footer__btn': true, 'warning-check__footer__submit': true, 'warning-check__footer__disabled': submitLoading}" @click="handle(2, 'submitLoading')">
                    <u-loading v-show="submitLoading" /> 提交
                </view>
            </view>
        </block>
    </view>
  </view>
</template>
<script>
import { listWarningRecordHandle, handleWarningRecordHandle } from "@/utils/api.js";
export default {
  components:{
  },
  data() {
    return {
        id: '',
        type: 1,
        // 提交加载Flag
        submitLoading: false,
        refuseLoading: false,
        acceptLoading: false,
        // 状态文案
        statusMap: [
            '', '提交', '提交', '通过', '驳回'
        ],
        // 状态颜色
        statusColorMap: [
            '', '#1539AF', '#1539AF', '#16B74F', '#FF2100'
        ],
        list: [],
        replyText: '', // 回复文本
        canHandle: false, // 是否可以操作
    };
  },
  onLoad(option) {
    this.loadRecordList(option.id);
    this.id = option.id;
    this.type = option.type;
  },
  computed: {
      // 是否允许提交
      canSubmit() {
          return this.$util.checkPermission('warnInfo:status:submit');
      },
      // 是否允许通过
      canAccept() {
          return this.$util.checkPermission('warnInfo:status:pass');
      },
      // 是否允许驳回
      canRefuse() {
          return this.$util.checkPermission('warnInfo:status:reject');
      },
      showFooter() {
          return this.canHandle && (this.canSubmit || this.canAccept || this.canRefuse);
      },
      // 底部的固定到底是两排按钮还是一排按钮?
      bottomButtonsHeight() {
          return (this.canSubmit && (this.canAccept || this.canRefuse)) ? 200 : 100;
      }
  },
  onPullDownRefresh() {
    this.loadRecordList(this.id);
  },
  methods: {
      // 加载处理列表
    loadRecordList(warningRecordId) {
        listWarningRecordHandle({warningRecordId}).then(res => {
          if (res.code == 200) {
            this.list = res.result;
            console.log(this.list);
            // 检查最后一条数据是否是已通过的状态，已通过不能再操作了
            if (this.list.length > 0) {
                this.canHandle = this.list[this.list.length - 1].status != 3;
            } else {
                this.canHandle = true;
            }
          } else {
            uni.showToast({
              title: '加载数据异常',
              icon: 'none'
            })
          }
        }).finally(e => {
            uni.stopPullDownRefresh();
        });
    },
    // 提交数据
    handle(status, loadingKey) {
        // 防止重复点击
        if (this.$data[loadingKey]) {
            return ;
        }
        if (!this.replyText) {
            uni.showToast({
                title: '请输入处理意见',
                icon: 'none'
            });
            return ;
        }
        this.$set(this, loadingKey, true);
        handleWarningRecordHandle({
            status, 
            content: this.replyText,
            warningRecordId: this.id
        }).then(resp => {
            if (resp.code == 200) {
                uni.showToast({
                    title: '提交成功',
                    icon: 'none'
                });
                // 填充的文本置空
                this.replyText = '';
                // 重新加载数据
                // uni.startPullDownRefresh();

                setTimeout(() => {
                    uni.setStorageSync('willRefresh', 1);
                    uni.navigateBack();
                }, 800);
            }
        }).finally(e => {
            this.$set(this, loadingKey, false);
        });

    },
  }
};
</script>
<style lang="scss" scoped>
.warning-check {
    height: 100vh;
    background:#f3f5f7;
    overflow: hidden;
    &__container {
        // height: calc(100vh - 200rpx);
        &__box {
            padding: 16rpx 28rpx;
            box-sizing: border-box;
            background: #fff;
            margin-bottom: 20rpx;
            &__item {
                display: flex;
                justify-content: space-between;
                &__field {
                    line-height: 40rpx;
                    padding: 10rpx 0;
                    &__creator {
                        font-weight: 500;
                    }
                    &__status {
                        font-size: 36rpx;
                        font-weight: 600;
                    }
                }
                &__field:nth-child(1) {
                    white-space:nowrap;;
                    max-width: 400rpx;
                }
                &__field:nth-child(2) {
                    text-align: right;
                }
            }
        }
        &__textarea {
            background: #fff;
            &__input {
                background: #fff;
            }
        }
    }
    &__footer {
        width: 100%;
        position: fixed;
        background: #f3f5f7;
        bottom: 0;
        &__line {
            // height: 100rpx;
            box-sizing: border-box;
            padding-top: 10rpx;
            display: flex;
            justify-content: center;
        }
        &__confirm {
            border-radius: 0 40rpx 40rpx 0;
            background: $my-main-color;
        }
        &__submit {
            border-radius: 0;
            width: 100% !important;
            // min-width: 400rpx;
            background: $my-main-color;
        }
        &__cancel {
            border-radius: 40rpx 0px 0px 40rpx;
            background: $my-cancel-color;
            color: #000 !important;
        }
        &__disabled {
            opacity: 0.8;
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