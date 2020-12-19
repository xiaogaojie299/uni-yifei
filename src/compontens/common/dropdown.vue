<template>
  <view>
        <u-dropdown>
          <u-dropdown-item
            v-model="value1"
            title="随机"
            :options="options1"
          ></u-dropdown-item>
          <u-dropdown-item
            v-model="value2"
            title="温度"
            :options="options2"
          ></u-dropdown-item>
          <u-dropdown-item
            v-model="value2"
            title="温度"
            :options="options2"
          ></u-dropdown-item>
        </u-dropdown>
      </view>
</template>
<script>
export default {
    data(){
        return {
            value1: 1,
				value2: 2,
				options1: [{
						label: '默认排序',
						value: 1,
					},
					{
						label: '距离优先',
						value: 2,
					},
					{
						label: '价格优先',
						value: 3,
					}
				],
				options2: [{
						label: '去冰',
						value: 1,
					},
					{
						label: '加冰',
						value: 2,
					},
				],
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/ .u-dropdown__menu{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:0 20rpx;
}
 /deep/ .u-dropdown__menu__item{
        display: flex;
        color: #fff;
       width: 220rpx !important;
        height: 44rpx;
        background: #5B74C7;
        border-radius: 22rpx;
  }
  /deep/ .u-dropdown__menu__item:nth-child(2){
     margin:0 20rpx;
  }
  /deep/ .u-dropdown__menu__item>view{
      padding:0 16rpx;
        width: 220rpx !important;
        display: flex;
        justify-content: space-between;
  }
  /deep/ .u-icon__icon{
      color: #fff !important;
  }
  /deep/ .u-dropdown__menu__item__text,.u-icon__icon{
      color: #fff !important;
  }
.header {
  height: 108rpx;
  background: $my-main-color;
}
</style>