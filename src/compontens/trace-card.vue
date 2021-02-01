<template>
    <view class="trace-card" @click="detail()">
        <view class="trace-card__header">
            <view class="trace-card__header__item"  v-for="(fields, sindex) in detailFields.header" :key="sindex">
                <view class="trace-card__header__item__field" v-for="(field, index) in fields" :key="index">
                    {{field.label}}<block v-if="field.label">：</block>
                    
                    <text class="value" :style="{color: warningStatusColorMap[item.status] || '#000'}" v-if="field.key == 'warningStatus'">{{ warningStatusMap[item['status']]}} {{field.suffix || ''}}</text>
                    <text class="value" :style="{color: statusColorMap[item.status] || '#000'}" v-else-if="field.key == 'status'">{{ statusMap[item[field.key]] || '' }} {{field.suffix || ''}}</text>
                    <text class="value" :style="{color: auditStatusColorMap[item.auditStatus] || '#000'}" v-else-if="field.key == 'auditStatus'">{{ auditStatusMap[item[field.key]] || '' }} {{field.suffix || ''}}</text>
                    <text class="value" :style="{color: field.color || '#000'}" v-else>{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                </view>
            </view>
        </view>

        <view class="trace-card__content">
            <view class="trace-card__content__item" v-for="(fields, sindex) in detailFields.fields" :key="sindex">
                <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                    {{field.label}}<block v-if="field.label">：</block>
                    <text class="value" :style="{color: field.color || '#000'}" v-if="field.callback" @tap.stop="field.callback">{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                    <text class="value" :style="{color: field.color || '#000'}" v-else>{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                </view>
            </view>
        </view>




            <!-- <view class="trace-card__header__title">
                <view v-if="mode == 'warning'">预警时间: {{ item.warningTime || '' }}</view>
                <view v-else>医废编号: {{ item.code || '' }}</view>
                <view v-if="mode != 'record' && mode != 'supply' && mode != 'collect' && mode != 'warning'">装箱编号: {{ item.boxCode || '' }}</view>
                <view v-if="mode == 'supply'">补录时间: {{ item.supplyTime }}</view>
            </view>
            <view class="trace-card__header__status" :style="{color: options.warning ? warningStatusColorMap[item.status] : '#FFB42B'}">
                <block v-if="options.status">{{ statusMap[item.status] }}</block>
                <block v-if="options.audit">{{ auditStatusMap[item.auditStatus] }}</block>
                <block v-if="options.warning">{{ warningStatusMap[item.status] }}</block>
            </view> -->



        <!-- <view class="trace-card__header">
            <view class="trace-card__header__item">
                <view class="trace-card__header__item__field">
                    asdklasjkdjalsds
                </view>
                <view class="trace-card__header__item__field">
                    adfasdfasdfasd
                </view>
            </view>
        </view>




        <view class="trace-card__content">
            <block v-if="mode == 'record' || mode == 'collect'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailRecord.fields" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value" :style="{color: field.color || '#000'}">{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'inventory'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailInventory.fields" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value" :style="{color: field.color || '#000'}">{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'checkout'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailCheckout.fields" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value" :style="{color: field.color || '#000'}">{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'restore'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailRestore.fields" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value" :style="{color: field.color || '#000'}">{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'supply'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailSupply.fields" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：<text class="value" :style="{color: field.color || '#000'}">{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                    </view>
                </view>
            </block>
            <block v-else-if="mode == 'warning'">
                <view class="trace-card__content__item" v-for="(fields, sindex) in detailWarning.fields" :key="sindex">
                    <view class="trace-card__content__item__field" v-for="(field, index) in fields" :key="index">
                        {{field.label}}：
                        <text class="value" :style="{color: field.color || '#000'}" v-if="field.callback" @tap.stop="field.callback">{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                        <text class="value" :style="{color: field.color || '#000'}" v-else>{{ item[field.key] || '' }} {{field.suffix || ''}}</text>
                    </view>
                </view>
            </block>
        </view> -->
        <!-- 当审核按钮开启时，需要查看该条数据是否处于未审核的状态才允许展示按钮 -->
        <view class="trace-card__footer" v-if="showFooter">
            <view class="trace-card__footer__button" @click.stop="record()" v-if="canRecord">
                流转过程
            </view>
            <view class="trace-card__footer__button" @click.stop="remove()" v-if="canDelete">
                删除
            </view>
            <view class="trace-card__footer__button primary" @click.stop="restore()" v-if="canRestore">
                恢复
            </view>
            <block v-if="canAudit">
                <view class="trace-card__footer__button primary" @click.stop="audit(true)">
                    通过
                </view>
                <view class="trace-card__footer__button primary" @click.stop="audit(false)">
                    拒绝
                </view>
            </block>
            <view class="trace-card__footer__button primary" @click.stop="warningCheck(1)" v-if="canCheckWarningSubmit">
                提交
            </view>
            <view class="trace-card__footer__button primary" @click.stop="warningCheck(2)" v-if="canCheckWarningAudit">
                处理
            </view>
        </view>
    </view>
</template>
<script>

/**
 * select 医废卡片页
 * @description 现用于多个，包含但不限于：追溯，入库，出库，收集记录，补录，数据恢复
 * @property {String} mode 模式选择，"record"-追溯， "collect"-收集记录，inventory"-入库，"checkout"-出库， "restore"-数据恢复，"supply"-医废补录，"warning"-预警信息
 * @property {String} options 参数配置，'remove'-删除按钮，'restore'-恢复按钮，'record'-流转过程，'detail'-详情页跳转，'status'-状态，'audit'-审核状态, 'warningCheck'-处理预警
 */
import { deleteMedicalTrace, auditSupplementMedicalTrace, restoreMedicalTrace } from '@/utils/api';
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
            statusColorMap: [
                '', '#FFB42B', '#FFB42B', '#FFB42B'
            ],
            auditStatusMap: [
                '', '未审核', '已通过', '已拒绝'
            ],
            auditStatusColorMap: [
                '', 'rgb(21, 57, 175)', 'rgb(82, 196, 26)', 'rgb(245, 34, 45)'
            ],
            warningStatusMap: [
                '', '未处理', '处理中', '通过', '驳回'
            ],
            warningStatusColorMap: [
                '', 'rgb(250, 173, 20)', 'rgb(21, 57, 174)', 'rgb(82, 196, 26)', 'rgb(245, 34, 45)'
            ],
            detailFields: {},
            detailRecord: {
                header: [
                    [
                        {
                            key: 'code',
                            label: '医废编号'
                        },
                        {
                            key: 'status',
                            label: '',
                            color: '#FFB42B'
                        }
                    ],
                ],
                fields: [
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
                            label: '重量',
                            suffix: 'kg'
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
                ]
            },
            detailCollect: {
                header: [
                    [
                        {
                            key: 'code',
                            label: '医废编号'
                        }
                    ],
                ],
                fields: [
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
                            label: '重量',
                            suffix: 'kg'
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
                ]
            },
            detailRestore: {
                header: [
                    [
                        {
                            key: 'code',
                            label: '医废编号'
                        }
                    ],
                    [
                        {
                            key: 'deleteTime',
                            label: '删除时间'
                        }
                    ]
                ],
                fields: [
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
                            label: '重量',
                            suffix: 'kg'
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
                ]
            },
            detailSupply: {
                header: [
                    [
                        {
                            key: 'code',
                            label: '医废编号'
                        },
                        {
                            key: 'auditStatus',
                            label: '',
                            color: '#FFB42B'
                        }
                    ],
                    [
                        {
                            key: 'supplyTime',
                            label: '补录时间'
                        },
                        {
                            key: 'status',
                            label: ''
                        }
                    ]
                ],
                fields: [
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
                            label: '重量',
                            suffix: 'kg'
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
                ]
            },
            detailInventory: {
                header: [
                    [
                        {
                            key: 'code',
                            label: '医废编号'
                        }
                    ],
                    [
                        {
                            key: 'boxCode',
                            label: '装箱编号'
                        }
                    ]
                ],
                fields: [
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
                        }
                    ],
                    [
                        {
                            key: 'wasteTypeStr',
                            label: '医废类型'
                        },
                        {
                            key: 'weight',
                            label: '重量',
                            suffix: 'kg'
                        },
                    ],
                    [
                        {
                            key: 'storeUser',
                            label: '入库人员'
                        },
                        {
                            key: 'storeTime',
                            label: '入库时间'
                        },
                    ]
                ]
            },
            detailCheckout: {
                header: [
                    [
                        {
                            key: 'code',
                            label: '医废编号'
                        }
                    ],
                    [
                        {
                            key: 'boxCode',
                            label: '装箱编号'
                        }
                    ]
                ],
                fields: [
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
                            label: '重量',
                            suffix: 'kg'
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
                ]
            },
            detailWarning: {
                header: [
                    [
                        {
                            key: 'warningTime',
                            label: '预警时间'
                        },
                        {
                            key: 'warningStatus',
                            label: ''
                        }
                    ]
                ],
                fields: [
                    [
                        {
                            key: 'typeName',
                            label: '预警类型'
                        },
                    ],
                    [
                        {
                            key: 'hospitalName',
                            label: '医院'
                        }
                    ],
                    [
                        {
                            key: 'officeName',
                            label: '科室'
                        },
                    ],
                    [
                        {
                            key: 'wasteTypeName',
                            label: '医废类型'
                        },
                        {
                            key: 'weight',
                            label: '重量',
                            suffix: 'kg'
                        },
                    ],
                    [
                        {
                            key: 'warningTargetName',
                            label: '预警对象',
                            color: '#1539AF',
                            callback: () => {
                                uni.navigateTo({
                                    url: '/pages-mw/mw/trace-record?id=' + this.item.warningTargetId + '&mode=' + this.mode
                                })
                            }
                        }
                    ],
                    [
                        {
                            key: 'message',
                            label: '预警信息'
                        }
                    ]
                ]
            }
        }
    },
    mounted() {
        this.setFields();
    },
    watch: {
        mode(n, o) {
            this.setFields();
        }
    },
    computed: {
        // 是否可以删除, 检查是否拥有权限并且开启了这个开关，下同
        canDelete() {
            return this.$util.checkPermission('trace:delete') && this.options.remove;
        },
        // 是否可以审核
        canAudit() {
            return this.$util.checkPermission('additional:audit') && this.options.audit && this.item.auditStatus == 1;
        },
        // 是否可以恢复
        canRestore() {
            return this.options.restore;
        },
        checkWarningText() {
            return (this.$util.checkPermissionAny([
                'warnInfo:status:submit', 'warnInfo:status:pass', 'warnInfo:status:reject'
            ])) && this.options.warningCheck && this.item.status != 3;
        },
        // 是否可以处理异常
        canCheckWarningSubmit() {
            return (this.$util.checkPermissionAny([
                'warnInfo:status:submit'
            ])) && this.options.warningCheck && this.item.status != 3;
        },
        // 是否可以处理异常
        canCheckWarningAudit() {
            return (this.$util.checkPermissionAny([
                'warnInfo:status:pass', 'warnInfo:status:reject'
            ])) && this.options.warningCheck && this.item.status != 3;
        },
        // 是否可以查看流转过程
        canRecord() {
            return this.options.record;
        },
        showFooter() {
            let flag = this.canRecord // 查看流转过程
                    || this.canDelete // 删除
                    || this.canRestore // 恢复
                    || this.canAudit // 审核
                    || this.canCheckWarningSubmit // 处理异常
                    || this.canCheckWarningAudit // 处理异常
                    ;
            return flag;
        }
    },
    methods: {
        setFields() {
            switch(this.mode) {
                case 'record':
                    this.detailFields = this.detailRecord;
                    break;
                case 'collect':
                    this.detailFields = this.detailCollect;
                    break;
                case 'inventory':
                    this.detailFields = this.detailInventory;
                    break;
                case 'checkout':
                    this.detailFields = this.detailCheckout;
                    break;
                case 'restore':
                    this.detailFields = this.detailRestore;
                    break;
                case 'supply':
                    this.detailFields = this.detailSupply;
                    break;
                case 'warning':
                    this.detailFields = this.detailWarning;
                    break;
            }
        },
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
            // console.log(this.canCheckWarning);
            // if ((this.options.warningDetail || false) &&  this.canCheckWarning) {
            //     this.warningCheck();
            // }
            if (this.options.warningDetail || false) {
                this.warningCheck(1);
            }
            if (this.options.detail || false) {
                uni.navigateTo({
                    url: '/pages-mw/mw/trace-detail?id=' + this.item.id + (this.mode != 'record' ? ('&mode=' + this.mode) : '')
                })
            }
        },
        record() {
            uni.navigateTo({
                url: '/pages-mw/mw/trace-record?id=' + this.item.id
            })
        },
        // 提交是1，审核是2
        warningCheck(type) {
            uni.navigateTo({
                url: '/pages-mw/warning/check?type=' + type + '&id=' + this.item.id
            })
        },
        itemClick(e, item, field) {
            // 如果需要处理，要阻止事件冒泡
            if (field.key == 'warningTargetName') {
                e.stopPropagation();
                // 开始计算
                console.log(e, item, field);
            }
        },
        restore() {
            let _this = this;
            uni.showModal({
                title: '提示',
                content: '您确认要恢复该条数据吗？',
                success: function (res) {
                    if (res.confirm) {
                        restoreMedicalTrace({
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
        line-height: 50rpx;
        font-size: 28rpx;
        // padding: 15rpx 0;
        &__item {
            padding: 6rpx 0;
            display: flex;
            justify-content: space-between;
            &__field {
                .value {
                    // font-weight: 500;
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
            &__field:last-child:first-child {
                white-space: nowrap;
                width: 100%;
                max-width: 100%;
            }
            &__field:nth-child(1) {
                max-width: 420rpx;
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