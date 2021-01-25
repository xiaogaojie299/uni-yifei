<template>
    <view class="mw-select flex-between">
        <view class="mw-select-container flex">
            <view class="mw-select-item group" @click="showCascade()" v-if="options.cascade || false">
                <text class="name">{{ cascadeData.label || '选择医院' }}</text>
            </view>
            <view class="mw-select-item group" @click="dateClick(2)" v-if="options.timestampSelect || false">
                <text class="name">{{timestampSelectValue || '查询时间'}}</text>
                <u-icon :name="!dateShow ? 'arrow-down': 'arrow-up'"></u-icon>
            </view>
        </view>
        <view class="mw-more" v-if="(options.waste || false) || (options.status || false) || (options.timestamp || false) || (options.warningType || false)|| (options.warningStatus || false)">
            <u-icon name="list-dot" size="48" color="#fff" @click="moreShow = !moreShow"></u-icon>
        </view>
        <u-popup v-model="moreShow" mode="right" @touchmove.stop.prevent="">
            <view class="tools-popup">
                <view class="tools-field" v-if="options.waste">
                    <view class="tools-field-name">
                        类型
                    </view>
                    <view class="tools-field-container">
                        <view :class="{tag: true, active: waste.id == wasteId}" :key="index" v-for="(waste, index) in wasteList" @click="selectWaste(index)">{{waste.itemText}}</view>
                    </view>
                </view>
                <view class="tools-field" v-if="options.status">
                    <view class="tools-field-name">
                        状态
                    </view>
                    <view class="tools-field-container">
                        <view :class="{tag: true, active: status == item.k}" :key="index" v-for="(item, index) in statusList" @click="selectStatus(index)">{{item.v}}</view>
                    </view>
                </view>
                <view class="tools-field" v-if="options.auditStatus">
                    <view class="tools-field-name">
                        审核状态
                    </view>
                    <view class="tools-field-container">
                        <view :class="{tag: true, active: auditStatus == item.k}" :key="index" v-for="(item, index) in auditStatusList" @click="selectAuditStatus(index)">{{item.v}}</view>
                    </view>
                </view>
                <view class="tools-field" v-if="options.warningType">
                    <view class="tools-field-name">
                        预警类型
                    </view>
                    <view class="tools-field-container">
                        <view :class="{tag: true, active: warningType == item.k}" :key="index" v-for="(item, index) in warningTypeList" @click="selectWarningType(index)">{{item.v}}</view>
                    </view>
                </view>
                <view class="tools-field" v-if="options.trans">
                    <view class="tools-field-name">
                        运输单位
                    </view>
                    <view class="tools-field-container">
                        <view :class="{tag: true, active: trans == item.k}" :key="index" v-for="(item, index) in transList" @click="selectTrans(index)">{{item.k}}</view>
                    </view>
                </view>
                <view class="tools-field" v-if="options.warningStatus">
                    <view class="tools-field-name">
                        预警状态
                    </view>
                    <view class="tools-field-container">
                        <view :class="{tag: true, active: warningStatus == item.k}" :key="index" v-for="(item, index) in warningStatusList" @click="selectWarningStatus(index)">{{item.v}}</view>
                    </view>
                </view>
                <view class="tools-field" v-if="options.timestamp">
                    <view class="tools-field-name">
                        时间
                    </view>
                    <view class="tools-field-container">
                        <view class="tag tag-date" @click="dateClick(0)">
                            <block v-if="startTime">
                                {{startTime}}
                            </block>
                            <block v-else>
                                <u-icon color="#000000" name="calendar" size="32"/> <text class="text">选择时间</text>
                            </block>
                        </view>
                        <view class="line" />
                        <view class="tag tag-date" @click="dateClick(1)">
                            <block v-if="endTime">
                                {{endTime}}
                            </block>
                            <block v-else>
                                <u-icon color="#000000" name="calendar" size="32"/> <text class="text">选择时间</text>
                            </block>
                        </view>
                    </view>
                </view>
                <view class="tools-submit flex-ver-center">
                    <view class="button-group">
                        <view class="button reset" @click="reset()">重置</view>
                        <view class="button submit" @click="confirm()">确定</view>
                    </view>
                </view>
            </view>
		</u-popup>
        <s-picker v-model="dateShow" mode="time" @confirm="dateChange" :params="dateSelectParms" :default-time="defaultTime"></s-picker>
    </view>
</template>
<script>
import { getMyHospitalCascadeList, getMyOfficeCascadeList, getWasteTypeList, listSelect } from '@/utils/api';
import * as dataUtils from "@/utils/getData";
import sSelect from './s-select';
import sPicker from './s-picker';
import sCheckbox from './s-checkbox';
import SSelectMulti from './s-select-multi.vue';
import { mapState } from 'vuex';

export default {
    components: {
        sSelect, sPicker, sCheckbox,
        SSelectMulti
    },
    props: {
        // 该属性是距离上部的像素值，主要用于Checkbox的展示
		marginTop: {
			type: Number,
			default() {
				return 80;
			}
        },
        options: {
            type: Object,
            default() {
                return {};
            }
        },
        defaultValue: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            cascadeData: {},
            timestampSelectValue: '', // 默认选中的时间
            officeCascadeLoading: false, // 部门加载中
            defaultTime: '',
            moreShow: false, // 更多筛选显示
            dateShow: false, // 日期选择显示
            dateSelectParms: {},
            dateTimeParams: {
                year: true,
                month: true,
                day: true,
                hour: true,
                minute: true,
                second: false
            },
            dateParams: {
                year: true,
                month: true,
                day: true
            },
            dateIndex: 0, // 判断日期选择是第一个还是第二个
            wasteList: [],
            statusList: [
                {
                    k: 1,
                    v: '未入库'
                },
                {
                    k: 2,
                    v: '已入库'
                },
                {
                    k: 3,
                    v: '已出库'
                },
                {
                    k: 0,
                    v: '全部'
                },
            ], // 状态列表
            auditStatusList: [
                {
                    k: 1,
                    v: '未审核'
                },
                {
                    k: 2,
                    v: '已通过'
                },
                {
                    k: 3,
                    v: '已拒绝'
                },
                {
                    k: 0,
                    v: '全部'
                },
            ], // 状态列表
            // 预警类型列表
            warningTypeList: [
                {
                    k: 1,
                    v: '未出医废',
                },
                {
                    k: 2,
                    v: '违规交接',
                },
                {
                    k: 3,
                    v: '入库超时',
                },
                {
                    k: 4,
                    v: '出库超时',
                },
                {
                    k: 5,
                    v: '遗失',
                },
                {
                    k: 6,
                    v: '入库重量',
                },
                {
                    k: 7,
                    v: '出库重量',
                },
                {
                    k: 8,
                    v: '泄露',
                },
                {
                    k: 9,
                    v: '破损',
                },
                {
                    k: 0,
                    v: '全部',
                }
            ],
            // 预警状态
            warningStatusList: [
                {
                    k: 1,
                    v: '未处理'
                },
                {
                    k: 2,
                    v: '处理中'
                },
                {
                    k: 3,
                    v: '通过'
                },
                {
                    k: 4,
                    v: '驳回'
                },
                {
                    k: 0,
                    v: '全部'
                },
            ],

            // 运输单位
            transList: [],

            cascadeId: '', // 选中的医院ID
            wasteId: '', // 选中的类型ID
            status: '', // 入库状态
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            warningType: '', // 预警类型
            warningStatus: '', // 预警状态
            auditStatus: '', // 审核状态
            trans: '',

        }
    },
    mounted() {
        this.setDefaultValue();
        this.loadWasteType();
    },
    computed: {
        ...mapState([
            'checkedNodes'
        ])
    },
    watch: {
        defaultValue: {
            handler: function(n, o) {
                this.setDefaultValue();
            },
            deep: true
        },
        checkedNodes: function(n) {
            this.cascadeData = n;
            this.cascadeId = n.value;
            if (this.options.trans) {
                this.loadTransList();
            }
            this.emitConfirm();
        }
    },
    methods: {
        setDefaultValue() {
            for (let i in this.defaultValue) {
                this.$set(this.$data, i, this.defaultValue[i]);
            }
            this.emitConfirm();

            // if (this.defaultValue.startTime && this.defaultValue.endTime) {
            //     this.startTime = this.defaultValue.startTime;
            //     this.endTime = this.defaultValue.endTime;
            //     this.emitConfirm();
            // }
            // if (this.warningStatus) {
            //     this.warningStatus = this.defaultValue.warningStatus;
            // }
            // if (this.status) {
            //     this.status = this.defaultValue.
            // }
        },
        showCascade() {
            this.$toTree(Object.assign(this.cascadeData, {}));
        },
        reset() {
            this.cascadeId = '';
            this.wasteId = '';
            this.status = '';
            this.startTime = '';
            this.endTime = '';
            this.warningType = '';
            this.warningStatus = '';
            this.auditStatus = '';
            this.cascadeLabel = '选择组织';
            this.transList = [];
            this.trans = '';
        },
        confirm() {
            this.moreShow = false;
            // 开始搜索
            this.emitConfirm();
        },
        emitConfirm() {
            this.$emit('confirm', {
                cascade: this.cascadeId,
                status: !this.status ? '' : this.status,
                auditStatus: !this.auditStatus ? '' : this.auditStatus,
                waste: this.wasteId,
                startTime: this.startTime,
                endTime: this.endTime,
                timestampSelectValue: this.timestampSelectValue,
                warningType: this.warningType,
                warningStatus: !this.warningStatus ? '' : this.warningStatus,
                trans: this.trans
            });
        },
        loadWasteType() {
            getWasteTypeList().then(resp => {
                if (resp.code == 200) {
                    this.wasteList = resp.result;
                }
            }).catch(err => {}).finally(e => {

            });
        },
        // 加载运输人员
        loadTransList() {
            listSelect({
                parentId: this.cascadeId, // 科室ID
                wasteType: this.waste
            }).then(resp => {
                if (resp.code == 200) {
                this.transList = resp.result.map(item => {
                    return {
                        // label: [item.engineDriver, item.licensePlate, item.transitCompany].join('/'),
                        k: item.transitCompany,
                        v: item.id
                    }
                });
                }
            });
        },
        // 选择类型
        selectWaste(index) {
            this.wasteId = this.wasteList[index].id;
            // 加载运输人员
            if (this.options.trans) {
                this.loadTransList();
            }
        },
        selectWarningType(index) {
            this.warningType = this.warningTypeList[index].k;
        },
        selectWarningStatus(index) {
            this.warningStatus = this.warningStatusList[index].k;
        },
        // 选择状态
        selectStatus(index) {
            this.status = this.statusList[index].k;
        },
        selectTrans(index) {
            this.trans = this.transList[index].k;
        },
        // 选择审核状态
        selectAuditStatus(index) {
            this.auditStatus = this.auditStatusList[index].k;
        },
        // 日期点击事件
        dateClick(index) {
            this.dateIndex = index;
            this.dateShow = true;
            switch(this.dateIndex) {
                case 0:
                    this.dateSelectParms = this.dateTimeParams;
                    this.startTime?this.defaultTime = this.startTime:(this.defaultTime = dataUtils.getTimeType()+" 00:00:00");  // 默认显示开始时间 00:00:00
                    break;
                case 1:
                    this.dateSelectParms = this.dateTimeParams;
                    this.endTime?this.defaultTime = this.endTime:(this.defaultTime = dataUtils.getTimeType()+" 23:59:59");  // 结束时间 默认显示 23:59:59
                    break;
                default:
                    this.dateSelectParms = this.dateParams;
                    this.defaultTime = this.timestampSelectValue;
                    break;
            }
        },
        // 日期变更时间，index是用来标识是前还是后
        dateChange(e) {
            let str = e.year + '-' + e.month + '-' + e.day ;
            let timestamp = new Date(str.replace(/-/g,"/")).getTime();
            switch(this.dateIndex) {
                case 0: 
                    // 需要校验：开始时间不允许大于结束时间
                    if (this.endTime != '') {
                        if (timestamp > new Date(this.endTime.replace(/-/g,"/")).getTime()) {
                            uni.showToast({
                                title: '开始时间必须小于结束时间',
                                icon: 'none'
                            });
                            break ;
                        }
                    }
                    str += ' ' + e.hour + ':' + e.minute + ':00';
                    console.log("this.startTime",str);
                    this.startTime = str;
                break;
                case 1:
                    // 需要校验：开始时间不允许小于结束时间
                    if (this.startTime != '') {
                        if (timestamp < new Date(this.startTime.replace(/-/g,"/")).getTime()) {
                            uni.showToast({
                                title: '开始时间必须小于结束时间',
                                icon: 'none'
                            });
                            break ;
                        }
                    }
                    str += ' ' + e.hour + ':' + e.minute + ':00';
                    this.endTime = str;
                break;
                default: 
                    this.timestampSelectValue = str;
                    this.emitConfirm();
                break;
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/uni.scss";
.mw-select {
    padding: 32rpx 20rpx;
    height: 100rpx;
    box-sizing: border-box;
    // width: 100%;
    position: relative;
    &-container {
        width: 100%;
        justify-content: space-around;
    }
    .mw-select-item {
        background: rgba(255, 255, 255, .3);
        border-radius: 30rpx;
        margin: 0 10rpx;
        min-width: 160rpx;
        height: 54rpx;
        padding: 2rpx 30rpx;
        color: #fff;
        display: flex;
        font-size: 24rpx;
        justify-content: space-around;
        align-items: center;
        .name {
            @include text-overflow;
        }
        &.group {
            min-width: 240rpx;
            max-width: 48%;
        }
    }
}
.tools-checkbox-list {
    width: 100%;
    position: absolute;
    top: 100rpx;
    left: 0;
    z-index: 10075;
}
.tools-checkbox {
    z-index: 10076;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}
.tools-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10074;
    background: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
}

.tools-popup {
    height: 100vh;
    box-sizing: border-box;

    .tools-field {
        margin: 20rpx;
        width: 620rpx;
        .tools-field-name {
            margin: 20rpx 0;
            color: #000000;
            font-size: 32rpx;
        }
        .tools-field-container {
            display: flex;
            flex-wrap: wrap;
            .tag {
                margin: 10rpx;
                border-radius: 36rpx;
                background: rgba(0,0,0,.1);
                color: #000000;
                font-size: 28rpx;
                // width: 170rpx;
                min-width: 170rpx;
                height: 60rpx;
                line-height: 60rpx;
                text-align: center;
                box-sizing: border-box;
                padding: 0 30rpx;
                @include text-overflow;
                &.tag-date {
                    width: 248rpx;
                    .text {
                        margin-left: 5rpx;
                    }
                }
                &.active {
                    background: $my-main-color;
                    color: #fff;
                }
            }
            .line {
                height: 80rpx;
                width: 60rpx;
                position: relative;
                &::after {
                    content: '';
                    position: absolute;
                    width: 40rpx;
                    height: 2rpx;
                    background: #979797;
                    top: 50%;
                    left: 10rpx;
                }
            }
        }
    }
    .tools-submit {
        position: fixed;
        bottom: 10rpx;
        width: 100%;
        padding: 60rpx 110rpx;
        .button-group {
            display: flex;
            .button {
                width: 200rpx;
                height: 80rpx;
                display: flex;
                color: #fff;
                justify-content: center;
                align-items: center;
                &.submit {
                    border-radius: 0 40px 40px 0;
                    background: $my-main-color;
                }
                &.reset {
                    border-radius: 40px 0px 0px 40px;
                    background: rgba(21, 57, 175, 0.8);
                }
            }
        }
    }
}
.header {
  height: 108rpx;
  background: $my-main-color;
}
</style>