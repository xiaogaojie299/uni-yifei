<template>
    <view>
        <scroll-view scroll-y class="checkbox-list" :style="{ height: height == 0 ? 'auto': height + 'rpx' }">
            <view :class="{'checkbox-item': true, active: item.checked || false}" :key="index" v-for="(item, index) in list" @click="tap(item, index)">
                {{item.label}}
                <u-icon name="checkbox-mark" size="34" class="icon" v-show="item.checked || false"/>
            </view>
        </scroll-view>
        <view class="checkbox-submit flex-ver-center" v-if="multi">
            <view class="button" @click="confirm">确定</view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        multi: {
            type: Boolean,
            default: false
        },
        dList: {
            type: Array,
            default: []
        },
        value: {
            type: Number,
            default: undefined
        },
        height: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            list: [],
            checked: []
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        dList: {
            handler: function(n, o) { 
                this.init();
            },
            deep: true
        },
        value(n, o) {
            if (n >= 0) {
                this.list[n].checked = true;
            }
        }
    },
    methods: {
        init() {
            this.list = [...this.dList];
        },
        tap(item, index) {
            if (!this.multi) {
                this.$emit('confirm', {item, index});
                return ;
            }

            let flag = this.list[index].checked || false;
            this.$set(this.list[index], 'checked', !flag);
            this.checked.push(index);
            this.checked = [...new Set(this.checked)]
            this.$emit('change', {item, index, checked: this.checked});
        },
        confirm() {
            this.$emit('confirm', this.checked);
        }
    }
};
</script>
<style lang="scss" scoped>
.checkbox-list {
    // padding: 0 20rpx;
    // box-sizing: border-box;
    .checkbox-item {
        @include flex-center;
        height: 100rpx;
        width: 100%;
        background: #fff;
        color: #000;
        font-weight: 500;
        font-size: 32rpx;
        position: relative;
        border-bottom: 1rpx solid rgba(0,0,0,.2);
        &.active {
            color: $my-main-color;
        }
        .icon {
            position: absolute; 
            right: 30rpx;
            bottom: 38rpx;
            color: $my-main-color;
        }
    }
}
.checkbox-submit {
    position: fixed;
    bottom: 0;
    margin: 60rpx 0;
    width: 100%;
    .button {
        width: 400rpx;
        height: 80rpx;
        display: flex;
        color: #fff;
        justify-content: center;
        align-items: center;
        border-radius: 40rpx;
        background: $my-main-color;
    }
}
</style>