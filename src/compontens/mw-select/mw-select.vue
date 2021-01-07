<template>
    <view class="mw-select flex-between" >
        <view class="mw-select-container flex">
            <view class="mw-select-item group" @click="showCascade()" v-if="options.cascade">
                <u-loading size="24" v-if="cascadeLoading"/>
                <text class="name">{{cascadeLabel}}</text>
                <u-icon :name="!cascadeShow ? 'arrow-down': 'arrow-up'"></u-icon>
            </view>
            <view class="mw-select-item department" @click="visibleDepartment()" v-if="options.cascade && options.department">
                <u-loading size="24" v-if="officalCascadeLoading"/>
                <text class="name">{{departmentLabel}}</text>
                <u-icon :name="!departmentShow ? 'arrow-down': 'arrow-up'"></u-icon>
            </view>
            <view class="mw-select-item" @click="visibleSubject()" v-if="options.cascade && options.department && options.subject">
                <text class="name">{{subjectLabel}}</text>
                <u-icon :name="!subjectShow ? 'arrow-down': 'arrow-up'"></u-icon>
            </view>
        </view>
        <view class="mw-more" v-if="options.waste || options.status || options.timestamp">
            <u-icon name="list-dot" size="48" color="#fff" @click="moreShow = !moreShow"></u-icon>
        </view>
        <u-popup v-model="moreShow" mode="right">
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
        <s-select mode="mutil-column-auto" title="选择组织" v-model="cascadeShow" :list="cascadeList" @confirm="cascadeCallback" :default-value="cascadeIndex"></s-select>
        <s-picker v-model="dateShow" mode="time" @confirm="dateChange" :params="dateParams"></s-picker>
        <s-select title="选择部门" v-model="departmentShow" :list="departmentList" @confirm="departmentCallback" :default-value="departmentIndex"></s-select>
        <s-select title="选择科室" v-model="subjectShow" :list="subjectList" @confirm="subjectCallback" :default-value="subjectIndex"></s-select>
    </view>
</template>
<script>
import { getMyHospitalCascadeList, getMyOfficeCascadeList, getWasteTypeList } from '@/utils/api';
import sSelect from './s-select';
import sPicker from './s-picker';
import sCheckbox from './s-checkbox';
import SSelectMulti from './s-select-multi.vue';
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
        }
    },
    data() {
        return {
            cascadeLoading: false, // 医院加载中
            officalCascadeLoading: false, // 部门加载中

            moreShow: false, // 更多筛选显示
            dateShow: false, // 日期选择显示
            departmentShow: false, // 部门选择显示
            departmentList: [], // 部门&科室列表
            subjectShow: false, // 科室选择显示
            subjectList: [], // 科室列表
            subjectIndex: [], // 索引
            departmentIndex: [], // 索引
            cascadeIndex: [], // 索引
            dateParams: {
                year: true,
                month: true,
                day: true,
                hour: true,
                minute: true,
                second: false
            },
            cascadeShow: false, // 医院选择显示
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
            cascadeList: [], 
            cascadeLabel: '选择组织',
            departmentLabel: '部门',
            subjectLabel: '科室',


            cascadeId: '', // 选中的医院ID
            wasteId: '', // 选中的类型ID
            subjectId: '', // 选中的科室ID
            status: '', // 入库状态
            departmentId: '',
            startTime: '', // 开始时间
            endTime: '', // 结束时间
        }
    },
    mounted() {
        this.loadHospitalCascade();
        this.loadWasteType();
    },
    computed: {
    },
    watch: {
        cascadeId(n, o) {
            n && this.loadOfficeCascadeList(n)
        },
        departmentShow(n, o) {
            n && (this.dateShow = this.cascadeShow = this.moreShow = this.subjectShow = false);
        },
        subjectShow(n, o) {
            n && (this.dateShow = this.cascadeShow = this.moreShow = this.departmentShow = false);
        },
        cascadeShow(n, o) {
            n && (this.dateShow = this.departmentShow = this.moreShow = this.subjectShow = false);
        },
        moreShow(n, o) {
            n && (this.cascadeShow = this.departmentShow = this.subjectShow = false);
        },
        dateShow(n, o) {
            n && (this.departmentShow = this.cascadeShow = this.subjectShow = false);
        }
    },
    methods: {
        showCascade() {
            if (this.cascadeLoading) {
                return ;
            }
            this.cascadeShow = !this.cascadeShow;
        },

        resetDepartment() {
            this.departmentLabel = '部门';
            this.departmentIndex = [];
            this.departmentId = '';
        },
        resetSubject() {
            this.subjectLabel = '科室';
            this.subjectIndex = [];
            this.subjectId = '';
        },
        reset() {
            this.cascadeId = '';
            this.wasteId = '';
            this.status = '';
            this.startTime = '';
            this.endTime = '';
            this.cascadeLabel = '选择组织';
            this.resetDepartment();
            this.resetSubject();
        },
        confirm() {
            this.moreShow = false;
            // 开始搜索
            this.emitConfirm();
        },
        emitConfirm() {
            this.$emit('confirm', {
                cascade: this.cascadeId,
                department: this.departmentId,
                subject: this.subjectId,
                status: this.status == 0 ? '' : this.status,
                waste: this.wasteId,
                startTime: this.startTime,
                endTime: this.endTime
            });
        },
        visibleDepartment() {
            // 如果没有选择医院，是不允许选择科室和部门的
            if (!this.cascadeId) {
                uni.showToast({
                    title: '请先选择组织',
                    icon: 'none'
                });
                return ;
            }
            if (this.officalCascadeLoading) {
                return ;
            }
            this.departmentShow = !this.departmentShow;
        },
        visibleSubject() {
            // 如果没有选择医院，是不允许选择科室和部门的
            if (!this.departmentId) {
                uni.showToast({
                    title: '请先选择部门',
                    icon: 'none'
                });
                return ;
            }
            console.log(this.subjectList);
            if (this.subjectList.length == 0) {
                uni.showToast({
                    title: '当前部门没有科室',
                    icon: 'none'
                });
                return ;
            }
            this.subjectShow = !this.subjectShow;
        },
        async loadWasteType() {
            let { code, message, result } = await getWasteTypeList();
            try {
                if (code == 200) {
                    this.wasteList = result;
                }
            } catch (error) {}
        },
        async loadHospitalCascade() {
            this.cascadeLoading = true;
            getMyHospitalCascadeList().then(resp => {
                if (resp.code == 200) {
                    this.cascadeList = resp.result[0].children || [];
                }
            }).catch(err => {}).then(e => {
                this.cascadeLoading = false;
            });
        },
        loadOfficeCascadeList(parentId) {
            this.officalCascadeLoading = true;
            getMyOfficeCascadeList({
                parentId
            }).then(resp => {
                if (resp.code == 200) {
                    this.departmentList = resp.result || [];
                }
            }).catch(err => {}).then(e => {
                this.officalCascadeLoading = false;
            });
        },
        // 科室选择的回调事件
        subjectCallback(e) {
            this.subjectId = e[0].value;
            this.subjectLabel = e[0].label;
            let index = this.subjectList.findIndex(item => item.value == e[0].value);
            if (index > -1) {
                this.subjectIndex = [index];
            }
            // 回调父组件
            this.emitConfirm();
        },
        // 部门选择的回调事件
        departmentCallback(e) {
            this.departmentId = e[0].value;
            this.departmentLabel = e[0].label;
            let index = this.departmentList.findIndex(item => item.value == e[0].value);
            if (index > -1) {
                // 这里仍然有一个问题，即：可能某些部门下没有科室，应该如何处理？

                // 1. 该条数据是处理有科室的，有科室继续选
                this.subjectList = this.departmentList[index].children || [];

                // 2. 该方法处理没有科室的，把当前部门的ID支持赋值给科室ID
                if (this.subjectList.length == 0) {
                    this.subjectId = e[0].value;
                    // 执行查询
                    this.emitConfirm();
                }

                this.departmentIndex = [index];
            }
        },
        cascadeIndexCalc(e) {
            let cascadeIndex = [];
            let tmpData = this.cascadeList;
            for (let i in e) {
                let index = tmpData.findIndex(item => item.value == e[i].value);
                if (index > -1) {
                    cascadeIndex.push(index);
                    tmpData = tmpData[index].children;
                }
            }
            this.cascadeIndex = cascadeIndex;
        },
        // 选择医院的回调
        cascadeCallback(e) {
            let hospital = e[e.length - 1];
            this.cascadeLabel = hospital.label;
            this.cascadeId = hospital.value;
            this.resetDepartment();
            this.resetSubject();
            // 计算一下他的4个索引，方便重新选择时继续渲染
            this.cascadeIndexCalc(e);
            // 回调父组件
            this.emitConfirm();
        },
        // 选择类型
        selectWaste(index) {
            this.wasteId = this.wasteList[index].id;
        },
        // 选择状态
        selectStatus(index) {
            this.status = this.statusList[index].k;
        },
        // 日期点击事件
        dateClick(index) {
            this.dateIndex = index;
            this.dateShow = true;
        },
        // 日期变更时间，index是用来标识是前还是后
        dateChange(e) {
            let str = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':00';
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
                    this.startTime = str;
                break;
                default:
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
                    this.endTime = str;
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
    position: relative;
    .mw-select-item {
        background: rgba(255, 255, 255, .3);
        border-radius: 30rpx;
        margin: 0 10rpx;
        width: 160rpx;
        height: 54rpx;
        padding: 2rpx 30rpx;
        color: #fff;
        display: flex;
        font-size: 24rpx;
        justify-content: space-between;
        align-items: center;
        .name {
            @include text-overflow;
        }
        &.group {
            width: 240rpx;
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
                width: 170rpx;
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