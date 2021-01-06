<template>
    <view class="trace-card" @click="detail()">
        <view class="trace-card__header">
            <view class="trace-card__header__title">
                <view>医废编号: {{ item.code }}</view>
                <view v-if="mode != 'record'">装箱编号: {{ item.boxCode }}</view>
            </view>
            <view class="trace-card__header__status">
                <block v-if="options.status">{{ statusMap[item.status] }}</block>
                <block v-if="options.audit">{{ auditStatusMap[item.auditStatus] }}</block>
            </view>
        </view>
        <view class="trace-card__content">
            <block v-if="mode == 'record'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailRecord" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value">{{ item[field.key] }}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'inventory'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailInventory" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value">{{ item[field.key] }}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'checkout'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailCheckout" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value">{{ item[field.key] }}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'restore'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailRestore" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value">{{ item[field.key] }}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'supply'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailSupply" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value">{{ item[field.key] }}</text>
                    </view>
                </view>
            </block>
        </view>
        <!-- 当审核按钮开启时，需要查看该条数据是否处于待审核的状态才允许展示按钮 -->
        <view class="trace-card__footer" v-if="options.record || options.remove || options.restore || (options.audit && item.auditStatus == 1)">
            <view class="trace-card__footer__button" @click.stop="record()" v-if="options.record">
                流转过程
            </view>
            <view class="trace-card__footer__button" @click.stop="remove()" v-if="options.remove">
                删除
            </view>
            <view class="trace-card__footer__button primary" @click.stop="restore()" v-if="options.restore">
                恢复
            </view>
            <view class="trace-card__footer__button primary" @click.stop="audit(true)" v-if="options.audit && item.auditStatus == 1">
                通过
            </view>
            <view class="trace-card__footer__button primary" @click.stop="audit(false)" v-if="options.audit && item.auditStatus == 1">
                拒绝
            </view>
        </view>
    </view>
</template>
<script>

	/**
	 * select 医废卡片页
	 * @description 现用于多个，包含但不限于：追溯，入库，出库，收集记录，补录，数据恢复
	 * @property {String} mode 模式选择，"record"-追溯/收集记录，inventory"-入库，"checkout"-出库， "restore"-数据恢复，"supply"-医废补录
	 * @property {String} options 参数配置，'remove'-删除按钮，'restore'-恢复按钮，'record'-流转过程，'detail'-详情页跳转，'status'-状态，'audit'-审核状态
	 */
import { deleteMedicalTrace, auditSupplementMedicalTrace } from '@/utils/api';
export default {
    props: {
        item: {
            type: Object,
            default: {}
        },
        options: {
            type: Object,
            default: {}
        },
        mode: {
            type: String,
            default: 'record'
        }
    },
    data(){
        return {
            statusMap: [
                '', '未入库', '已入库', '已出库'
            ],
            auditStatusMap: [
                '', '待审核', '已通过', '已拒绝'
            ],

            // 溯源的数据列表
            detailRecord: [
                [
                    {
                        key: 'hospitalName',
                        label: '医院'
                    }
                ],
                [
                    {
                        key: 'departmentName',
                        label: '科室'
                    },
                    {
                        key: 'departmentUserName',
                        label: '科室人员'
                    }
                ],
                [
                    {
                        key: 'wasteTypeStr',
                        label: '医废类型'
                    },
                    {
                        key: 'weight',
                        label: '重量(kg)'
                    }
                ],
                [
                    {
                        key: 'creator',
                        label: '收集人员'
                    },
                    {
                        key: 'createTime',
                        label: '收集时间'
                    }
                ]
            ],
            // 数据恢复的数据列表
            detailRestore: [
                [
                    {
                        key: 'deleteTime',
                        label: '删除时间'
                    }
                ],
                [
                    {
                        key: 'hospitalName',
                        label: '医院'
                    }
                ],
                [
                    {
                        key: 'departmentName',
                        label: '科室'
                    },
                    {
                        key: 'departmentUserName',
                        label: '科室人员'
                    }
                ],
                [
                    {
                        key: 'wasteTypeStr',
                        label: '医废类型'
                    },
                    {
                        key: 'weight',
                        label: '重量(kg)'
                    }
                ],
                [
                    {
                        key: 'creator',
                        label: '收集人员'
                    },
                    {
                        key: 'createTime',
                        label: '收集时间'
                    }
                ]
            ],
            // 补录的数据列表
            detailSupply: [
                [
                    {
                        key: 'supplyTime',
                        label: '补录时间'
                    }
                ],
                [
                    {
                        key: 'hospitalName',
                        label: '医院'
                    }
                ],
                [
                    {
                        key: 'departmentName',
                        label: '科室'
                    },
                    {
                        key: 'departmentUserName',
                        label: '科室人员'
                    }
                ],
                [
                    {
                        key: 'wasteTypeStr',
                        label: '医废类型'
                    },
                    {
                        key: 'weight',
                        label: '重量(kg)'
                    }
                ],
                [
                    {
                        key: 'creator',
                        label: '收集人员'
                    },
                    {
                        key: 'createTime',
                        label: '收集时间'
                    }
                ]
            ],
            // 入库的数据列表
            detailInventory: [
                [
                    {
                        key: 'hospitalName',
                        label: '医院'
                    },
                    {
                        key: 'departmentName',
                        label: '科室'
                    },
                ],
                [
                    {
                        key: 'wasteTypeStr',
                        label: '医废类型'
                    },
                    {
                        key: 'weight',
                        label: '重量(kg)'
                    },
                ],
                [
                    {
                        key: 'storeTime',
                        label: '入库人员'
                    },
                    {
                        key: 'storeUser',
                        label: '入库时间'
                    },
                ]
            ],
            // 出库的数据列表
            detailCheckout: [
                [
                    {
                        key: 'hospitalName',
                        label: '医院'
                    },
                    {
                        key: 'departmentName',
                        label: '科室'
                    },
                ],
                [
                    {
                        key: 'wasteTypeStr',
                        label: '医废类型'
                    },
                    {
                        key: 'weight',
                        label: '重量(kg)'
                    },
                ],
                [
                    {
                        key: 'engineDriver',
                        label: '运输人员'
                    },
                    {
                        key: 'licensePlate',
                        label: '车牌号'
                    },
                ],
                [
                    {
                        key: 'transitCompany',
                        label: '运输单位'
                    }
                ],
                [
                    {
                        key: 'checkoutUser',
                        label: '出库人员'
                    },
                    {
                        key: 'checkoutTime',
                        label: '出库时间'
                    },
                ]
            ],
        }
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        audit(flag) {
            let auditStatus = flag ? 2 : 3;
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '是否要' + (flag ? '通过' : '拒绝') + '审核？',
                success: function (res) {
                    if (res.confirm) {
                        auditSupplementMedicalTrace({
                            auditStatus,
                            id: _this.item.id
                        }).then(resp => {
                            if (resp.code == 200) {
                                uni.showToast({
                                    title: '操作成功',
                                    icon: 'none'
                                });
                                _this.$emit('audit', {item: _this.item, flag});
                            }
                        });
                    }
                }
            });
        },
        detail() {
            (this.options.detail || false) && uni.navigateTo({
                url: '/pages/admin/mw/trace-detail?id=' + this.item.id + (this.mode != 'record' ? ('&mode=' + this.mode) : '')
            })
        },
        record() {
            uni.navigateTo({
                url: '/pages/admin/mw/trace-record?id=' + this.item.id
            })
        },
        restore() {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '您确认要恢复该条数据吗？',
                success: function (res) {
                    if (res.confirm) {
                        deleteMedicalTrace({
                            id: _this.item.id
                        }).then(resp => {
                            if (resp.code == 200) {
                                uni.showToast({
                                    title: '恢复成功',
                                    icon: 'none'
                                });
                                _this.$emit('restore', _this.item);
                            }
                        });
                    }
                }
            });
        },
        remove() {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '您确认要删除吗？',
                success: function (res) {
                    if (res.confirm) {
                        // 点击删除
                        deleteMedicalTrace({
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
.trace-card {
    // height: 410rpx;
    padding: 10rpx 28rpx;
    margin: 20rpx 0;
    background: #fff;
    box-sizing: border-box;
    &__header {
        // height: 70rpx;
        line-height: 50rpx;
        font-size: 28rpx;
        // font-weight: 500;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        &__status {
            color: #FFB42B;
        }
    }
    &__content {
        border-top: 1rpx solid rgba(0,0,0,.2);
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