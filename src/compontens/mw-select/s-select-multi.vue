<template>
    <view class="s-select-multi">
		<u-popup :border-radius="40" :maskCloseAble="maskCloseAble" mode="bottom" :popup="false" v-model="value" length="auto" :safeAreaInsetBottom="safeAreaInsetBottom" @close="close" :z-index="uZIndex">
            <view class="s-select-multi">
                <view class="s-select-multi__header" @touchmove.stop.prevent="">
					<view class="s-select-multi__header__title">
						{{title}}
					</view>
                </view>
                <scroll-view scroll-y class="s-select-multi__content">
                    <view :class="{'s-select-multi__content__item': true, active: item.checked || false}" :key="index" v-for="(item, index) in list" @click="tap(item, index)">
                        {{item.label}}
                        <u-icon name="checkbox-mark" size="34" class="icon" v-show="item.checked || false"/>
                    </view>
                </scroll-view>

				<view class="s-select-multi__footer">
					<view
						class="s-select-multi__footer__cancel s-select-multi__footer__btn"
						:style="{ color: cancelColor }"
						hover-class="u-hover-class"
						:hover-stay-time="150"
						@tap="close"
					>
						{{cancelText}}
					</view>
					<view
						class="s-select-multi__footer__confirm s-select-multi__footer__btn"
						:style="{ color: confirmColor }"
						hover-class="u-hover-class"
						:hover-stay-time="150"
						@touchmove.stop=""
						@tap.stop="confirm"
					>
						{{confirmText}}
					</view>
				</view>
            </view>
		</u-popup>
    </view>
</template>
<script>
export default {
    props: {
        // "取消"按钮的颜色
		cancelColor: {
			type: String,
			default: '#000'
		},
		// "确定"按钮的颜色
		confirmColor: {
			type: String,
			default: '#fff'
		},
		// 取消按钮的文字
		cancelText: {
			type: String,
			default: '取消'
		},
		// 确认按钮的文字
		confirmText: {
			type: String,
			default: '确认'
		},
		// 弹出的z-index值
		uZIndex: {
			type: [String, Number],
			default: 0
		},
		// 标题
		title: {
			type: String,
			default: ''
		},
		safeAreaInsetBottom: {
			type: Boolean,
			default: false
		},
		// 是否允许通过点击遮罩关闭Picker
		maskCloseAble: {
			type: Boolean,
			default: true
		},
        multi: {
            type: Boolean,
            default: false
        },
        dList: {
            type: Array,
            default: []
        },
        value: {
            type: Boolean,
            default: false
        },
        checkedList: {
            type: Array,
            default: []
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
        dList(n, o) {
            this.init();
        },
        checkedList: {
            handler: function(n, o) { 
                this.init();
            },
            deep: true
        },
        value(n, o) {
            n && this.init();
        }
    },
    methods: {
        init() {
            this.list = JSON.parse(JSON.stringify(this.dList));
            this.checked = [];
            for (let i in this.checkedList) {
                this.$set(this.list[i], 'checked', true);
                this.checked.push(parseInt(i));
            }
        },
        tap(item, index) {
            let flag = this.list[index].checked || false;
            this.$set(this.list[index], 'checked', !flag);

            if (!this.multi) {
                this.$emit('confirm', {item, index, checked: [index]});
			    this.$emit('input', false);
                return ;
            }
            // 如果数组中还有，就清除掉
            // 否则，PUSH
            // 检查是否已经存在
            let existIndex = this.checked.findIndex(i => i == index);
            if (existIndex > -1) {
                this.checked.splice(existIndex, 1);
            } else {
                this.checked.push(index);
            }
            this.$emit('change', {item, index, checked: this.checked});
        },
        close() {
			this.$emit('input', false);
        },
        confirm() {
            this.$emit('confirm', {item: undefined, index: undefined, checked: this.checked});
            this.$emit('input', false);
        }
    }
};
</script>
<style lang="scss" scoped>
.s-select-multi {
	&__header {
		display: flex;
		justify-content: center;
		align-items: center;
        height: 100rpx;
		&__title {
			color: #000;
			font-weight: 500;
			font-size: 36rpx;
			height: 50rpx;
			padding: 20rpx 0;
			width: 100%;
			text-align: center;
		}
	}
	&__footer {
		height: 180rpx;
		box-sizing: border-box;
		padding: 30rpx 0 60rpx 0;
		display: flex;
		justify-content: center;
		&__confirm {
			border-radius: 0 40px 40px 0;
			background: $my-main-color;
		}
		&__cancel {
			border-radius: 40px 0px 0px 40px;
			background: $my-cancel-color;
			color: #000;
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
    &__content {
        padding: 20rpx 0;
        // box-sizing: border-box;
        max-height: 500rpx;
        min-height: 200rpx;
        // height: 300rpx;
        &__item {
            @include flex-center;
            height: 80rpx;
            width: 100%;
            background: #fff;
            color: rgba(0,0,0,.6);
            font-size: 32rpx;
            padding: 20rpx 0;
            box-sizing: border-box;
            position: relative;
            &.active {
                color: #000;
                // color: $my-main-color;
                font-weight: 500;
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
        bottom: 0;
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
}
</style>