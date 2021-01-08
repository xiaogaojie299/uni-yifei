<template>
    <view class="warning-config">
        <u-cell-group>
            <u-cell-item :title="label" :arrow="true"  arrow-direction="right" @click="jump()" />
            <u-cell-item title="自定义时长设置" :arrow="true"  arrow-direction="right" @click="jumpCustom()" />
        </u-cell-group>
    </view>
</template>
<script>
export default {
  components:{
  },
  onLoad(option) {
      this.type = option.type;
      // 未出医废预警
      if (this.type == 1) {
          this.label = '默认未出医废时长设置';
          uni.setNavigationBarTitle({
              title: '未出医废预警'
          });
      } else 
      // 出库超时预警
      if (this.type == 4) {
          this.label = '默认出库超时时长设置';
          uni.setNavigationBarTitle({
              title: '出库超时预警'
          });
      }
  },
  data() {
      return {
        type: '', // 配置的类型ID
        label: '', // 文本文案
      }
  },
  watch: {
  },
  methods: {
      // 跳转到配置设置界面
      jump() {
        uni.navigateTo({
            url: '/pages/admin/warning/setting?type=' + this.type
        })
      },
      // 跳转到选择医院界面
      jumpCustom() {
        uni.navigateTo({
            url: '/pages/admin/warning/custom?type=' + this.type
        })
      }
  }
}
</script>
<style lang="scss" scoped>
</style>