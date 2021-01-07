<template>
    <view class="outbound-setting-card" @click="detail()">
        <view class="outbound-setting-card__content">
            <block>
                <view class="outbound-setting-card__content__item" v-for="(fields, sindex) in fieldList" :key="sindex">
                    <view class="outbound-setting-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value">{{ item[field.key] }}</text>
                    </view>
                </view>
            </block>
        </view>
        <view class="outbound-setting-card__footer">
            <view class="outbound-setting-card__footer__button" @click.stop="edit()">
                编辑
            </view>
            <view class="outbound-setting-card__footer__button" @click.stop="remove()">
                删除
            </view>
        </view>
    </view>
</template>
<script>
import { deleteTransitConfig } from '@/utils/api';
export default {
    props: {
        item: {
            type: Object,
            default: {}
        }
    },
    data(){
        return {
            fieldList: [
                [
                    {
                        key: 'hospitalName',
                        label: '医院'
                    }
                ],
                [
                    {
                        key: 'engineDriver',
                        label: '运输人员'
                    }
                ],
                [
                    {
                        key: 'licensePlate',
                        label: '车牌号'
                    }
                ],
                [
                    {
                        key: 'transitCompany',
                        label: '运输单位'
                    }
                ],
                [
                    {
                        key: 'wasteType',
                        label: '准运类型'
                    }
                ],
                [
                    {
                        key: 'area',
                        label: '区域'
                    }
                ]
            ]
        }
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        detail() {
            try {
                // 没有单独的接口，直接跳转
                uni.setStorageSync('cache:outbound:detail', this.item);
                // 跳转
                uni.navigateTo({
                    url: '/pages/admin/mw/outbound-setting-detail'
                })
            } catch (e) {
                // error
                uni.showToast({
                    title: '详情获取失败',
                    icon: 'none'
                });
            }
        },
        edit() {
            try {
                // 没有单独的接口，直接跳转
                uni.setStorageSync('cache:outbound:detail', this.item);
                uni.navigateTo({
                    url: '/pages/admin/mw/outbound-setting-edit'
                })
            } catch (e) {
                // error
                uni.showToast({
                    title: '详情获取失败',
                    icon: 'none'
                });
            }
        },
        remove() {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '您确定要删除吗？删除后数据将无法恢复。',
                success: function (res) {
                    if (res.confirm) {
                        // 点击删除
                        deleteTransitConfig({
                            id: _this.item.id
                        }).then(resp => {
                            if (resp.code == 200) {
                                uni.showToast({
                                    title: '删除成功',
                                    icon: 'none'
                                });
                                _this.$emit('remove', _this.item);
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
.outbound-setting-card {
    // height: 410rpx;
    padding: 10rpx 28rpx;
    margin: 20rpx 0;
    background: #fff;
    box-sizing: border-box;
    &__content {
        padding: 15rpx 0;
        &__item {
            padding: 6rpx 0;
            display: flex;
            justify-content: space-between;
            &__field {
                .value {
                    font-weight: 500;
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
    &__footer {
        border-top: 1rpx solid rgba(0,0,0,.2);
        padding: 20rpx 0;
        display: flex;
        justify-content: flex-end;
        &__button {
            margin: 0 6rpx;
            @include flex-center;
            padding: 16rpx 32rpx;
            height: 60rpx;
            border-radius: 30rpx ;
            min-width: 160rpx;
            font-size: 24rpx;
            color: #000;
            border: 1rpx solid #d7d9db;
            background: rgba(255,255,255,.2);
            &.primary {
                border: 1px solid $my-main-color;
                color: $my-main-color;
            }
        }
    }
}
</style>