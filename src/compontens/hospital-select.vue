<template>
    <view class="hosital-select" v-show="value">
        <s-select mode="mutil-column-auto" :title="title" v-model="show" :list="cascadeList" @confirm="cascadeCallback" :default-value="cascadeIndex"></s-select>
    </view>
</template>
<script>
import { getMyHospitalCascadeList, getMyOfficeCascadeList } from '@/utils/api';
import sSelect from '@/compontens/s-select';
export default {
    components: {
        sSelect
    },
    props: {
        hospitalId: [Number, String], // 是否是医院或者科室
        value: Boolean, // 显示
        defaultValue: {
            type: Array,
            default() {
				return []
			}
        }, // 默认选中
        title: String,
        defaultIds: {
            type: Array,
            default() {
				return []
			}
        }
    },
    data(){
        return {
            cascadeIndex: [],
            cascadeList: [],
            show: false
        }
    },
    watch: {
        value(n, o) {
            this.show = n;
        },
        defaultValue(n, o) {
            this.cascadeIndex = n;
        },
        defaultIds(n, o) {
            this.calcIndex(n, true);
        },
        show(n, o) {
            !n && this.$emit('input', false);
        },
        hospitalId(n, o) {
            this.loadHospitalCascade();
        }
    },
    mounted() {
        this.loadHospitalCascade();
    },
    methods: {
        calcIndex(e, isIndex) {
            let tmpIndex = [];
            let tmpData = this.cascadeList;
            for (let i in e) {
                let index = tmpData.findIndex(item => item.value == (!isIndex ? e[i].value : e[i]));
                if (index > -1) {
                    tmpIndex.push(index);
                    tmpData = tmpData[index].children;
                }
            }
            this.cascadeIndex = tmpIndex;
        },
        loadHospitalCascade() {
            console.log('hello ?');
            this.$emit('loading');
            if (this.hospitalId) {
                getMyOfficeCascadeList({
                    parentId: this.hospitalId
                }).then(resp => {
                    if (resp.code == 200) {
                        this.cascadeList = resp.result || [];
                        // 要计算一下是否有默认ID列表
                        this.calcIndex(this.defaultIds, true);
                    }
                }).finally(e => {
                    this.$emit('loaded');
                });
            } else {
                // 加个缓存
                getMyHospitalCascadeList().then(resp => {
                    if (resp.code == 200) {
                        this.cascadeList = resp.result[0].children || [];
                        // 要计算一下是否有默认ID列表
                        this.calcIndex(this.defaultIds, true);
                    }
                }).catch(err => {}).finally(e => {
                    this.$emit('loaded');
                });
                console.log('hello1 ?');
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
            this.$emit('confirm', {
                e, index: this.cascadeIndex
            });
        },
        // 选择医院的回调
        cascadeCallback(e) {
            // 计算一下他的4个索引，方便重新选择时继续渲染
            this.cascadeIndexCalc(e);
            this.$emit('input', false);
        },
    }
};
</script>
<style lang="scss" scoped>
.s-loading {
    height: 60rpx;
    line-height: 60rpx;
}
</style>