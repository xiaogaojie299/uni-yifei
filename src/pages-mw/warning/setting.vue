<template>
    <view class="warning-setting">
        <view class="warning-setting__empty-container flex-ver-center" v-if="type == 2">
            暂无配置
        </view>
        <block v-else>
            <u-field :disabled="disabled" :label="labelList[type].label" label-width="300" input-align="right" v-model="defaultValue" :border-bottom="true" :placeholder="labelList[type].placeholder" :clearable="false" @click="showKeyboard" disabled v-if="type > 5"/>
            <u-field :disabled="disabled" :label="labelList[type].label" label-width="300" input-align="right" v-model="defaultValue" :border-bottom="true" :placeholder="labelList[type].placeholder" :clearable="false" @click="showKeyboard" disabled v-else/>
            <block v-if="type == 8 || type == 9">
                <u-cell-group>
                    <u-cell-item :disabled="disabled" title="设置类型值" @click="" :arrow="true"  arrow-direction="right" :value="wasteLabel">
                        <u-loading v-show="wasteLoading" slot="icon"/>
                    </u-cell-item>
                </u-cell-group>
                <s-select-multi title="选择类型" v-model="wasteShow" :d-list="wasteList" @confirm="wasteCallback" :checked-list="wasteIndex" multi></s-select-multi>
            </block>
            <view class="warning-setting__button__container">
                <view :class="{button: true, 'button__disabled': submitLoading || disabled}" @click="submit()" :disabled="disabled">
                    <u-loading style="margin-right: 10rpx" v-if="submitLoading" /> {{submitLoading ? '提交中' : '提交'}}
                </view>
            </view>
        </block>
        <u-keyboard :tips="defaultValue" mode="number" @change="valChange" @backspace="backspace" v-model="valueShow" :dot-enabled="type >= 5"></u-keyboard>
    </view>
</template>
<script>
import sField from '@/compontens/s-field';
import sSelectMulti from '@/compontens/s-select-multi';
import { detailWarningConfigType, getWasteTypeList, editWarningConfigType } from '@/utils/api';
export default {
  components:{
      sField, sSelectMulti
  },
  computed: {
      disabled() {
          return !this.$util.checkPermission('warning:setting:type' + this.type);
      }
  },
  onLoad(option) {
      this.type = option.type;
      this.loadType();
      this.loadWasteType();
      // 自定义页面标题
      uni.setNavigationBarTitle({
          title: this.labelList[this.type].title
      })
  },
  data() {
      return {
          valueShow: false,

        type: '', // 配置的类型ID
        config: {}, // 配置信息
        defaultValue: '', // 默认配置数值

        submitLoading: false,
        wasteShow: false,
        wasteLoading: false,
        wasteIds: [], // 医废类型被选中的ID列表
        wasteList: [], // 医废类型列表
        wasteIndex: [], // 被选中的医废类型
        wasteLabel: '', // 医废的文本展示

        labelList: [
            {}, 
            {
                label: '设置未出医废时长(天)',
                placeholder: '填写时长(纯数字，不能有小数)',
                title: '未出医废预警'
            }, // 1 
            {
                label: '设置违规交接时长(天)',
                placeholder: '填写时长(纯数字，不能有小数)',
                title: '违规交接预警'
            }, // 2
            {
                label: '设置入库超时时长(天)',
                placeholder: '填写时长(纯数字，不能有小数)',
                title: '入库超时预警'
            }, // 3
            {
                label: '设置出库超时时长(天)',
                placeholder: '填写时长(纯数字，不能有小数)',
                title: '出库超时预警'
            }, // 4
            {
                label: '设置遗失时长(天)',
                placeholder: '填写时长(纯数字，不能有小数)',
                title: '遗失预警'
            }, // 5
            {
                label: '默认入库重量偏差值(kg)',
                placeholder: '填写重量(数字，支持小数)',
                title: '入库重量偏差预警'
            }, // 6
            {
                label: '默认出库重量偏差值(kg)',
                placeholder: '填写重量(数字，支持小数)',
                title: '出库重量偏差预警'
            }, // 7
            {
                label: '默认泄露重量偏差值(kg)',
                placeholder: '填写重量(数字，支持小数)',
                title: '泄露重量偏差预警'
            }, // 8
            {
                label: '默认破损重量偏差值(kg)',
                placeholder: '填写重量(数字，支持小数)',
                title: '破损重量偏差预警'
            }, //9
        ]
      }
  },
  watch: {
      wasteIds(n, o) {
          // ID列表变动了过后要计算一次
          this.calcWasteType();
      },
      wasteList(n, o) {
          // 医废类型列表变动了要计算一次
          this.calcWasteType();
      }

  },
  methods: {
        showWaste() {
            if (this.disabled) return ;
            this.wasteShow = true
        },
        showKeyboard() {
            if (this.disabled) return ;
            this.valueShow = true;
        },
        // 按键被点击(点击退格键不会触发此事件)
        valChange(val) {
            if (this.disabled) return ;
            if (val == '.') {
                if (this.defaultValue.indexOf('.') > -1) {
                return ;
                }
            }
            // 将每次按键的值拼接到value变量中，注意+=写法
            if (this.defaultValue == '0') {
                this.defaultValue = '' + val;
            } else {
                this.defaultValue += val;
            }
        },
        // 退格键被点击
        backspace() {
            // 删除value的最后一个字符
            if(this.defaultValue.length) this.defaultValue = this.defaultValue.substr(0, this.defaultValue.length - 1);
        },
        // 这里不能用计步器，只能用个正则解决下了
      numberCheck() {
        // 某种情况下只允许输入整数,前5个类型支持整数
        let isDigits = this.type <= 5;
        let result = false;
        if (isDigits) {
            result = this.$u.test.digits(this.defaultValue);
        } else {
            // 某种情况下可以支持小数
            result = this.$u.test.number(this.defaultValue)
        }
        if (this.defaultValue <= 0) {
            result = false;
        }
        let dialogText = (isDigits ? '时长' : '重量') + '应该为一个大于0的' + (isDigits ? '正整数' : '正数');
        if (!result) {
            uni.showToast({
                title: dialogText,
                icon: 'none'
            });
            return false;
        }
        return true;
      },
      wasteCallback(e) {
          this.wasteIndex = e.checked;
          this.wasteIds = [];
          // 把ID变动就可以了，watch属性里会自动解决
          for (let i in this.wasteIndex) {
              this.wasteIds.push(this.wasteList[this.wasteIndex[i]].value);
          }
      },
      // 设置选中医废类型,医废类型列表和医废ID变动，都要计算一次，防止异步问题
      calcWasteType() {
          this.wasteIndex = [];
          this.wasteLabel = '';
          let wasteLabel = [];
          for (let i in this.wasteIds) {
              let index = this.wasteList.findIndex(item => item.value == this.wasteIds[i]);
              if (index > -1) {
                  // 文本push到数组，而后用join
                  wasteLabel.push(this.wasteList[index].label);
                  // 索引记录一下
                  this.wasteIndex.push(index);
              }
          }
          this.wasteLabel = wasteLabel.join('/');
      },
      // 获取医废类型列表
      loadWasteType() {
        this.wasteLoading = true;
        getWasteTypeList().then(resp => {
            if (resp.code == 200) {
            this.wasteList = resp.result.map(item => {
                return {
                    label: item.itemText,
                    value: item.id
                }
            });
            }
        }).catch(err => {}).finally(e => {
            this.wasteLoading = false;
        });;
      },
      loadType() {
          detailWarningConfigType({
              type: this.type
          }).then(resp => {
              if (resp.code == 200) {
                  // 设置默认值
                  this.defaultValue = '' + (resp.result.defaultValue || 0);
                  // 计算医废类型，设置文本并设置为选中
                  if (resp.result.wasteTypes) {
                      this.wasteIds = resp.result.wasteTypes.split(',');
                  }
              }
          });
      },
      submit() {
          if (this.disabled) return ;
          let checkFlag = false;
          if (this.type < 6 || this.defaultValue != '') {
            // 再次校验数字
            if (!this.numberCheck()) {
                return ;
            }
          }
          // todo 无需校验是否选择了类型
          if ((this.type == 8 || this.type == 9) && this.wasteIds == '') {
                uni.showToast({
                    title: '请选择类型',
                    icon: 'none'
                })
              return ;
          }
          // 开始提交
          this.submitLoading = true;
          editWarningConfigType({
              defaultValue: +this.defaultValue,
              type: this.type,
              wasteTypes: this.wasteIds.join(',')
          }).then(resp => {
              if (resp.code == 200) {
                  uni.showToast({
                      title: '提交成功',
                      icon: 'none'
                  })
                  setTimeout(function() {
                      uni.navigateBack();
                  }, 1000);
              }
          }).finally(e => {
              this.submitLoading = false;
          });

      }
  }
}
</script>
<style lang="scss" scoped>
.warning-setting {
  &__empty-container {
      height: 100vh;
      font-size: 32rpx;
      color: #000;
  }
  &__button__container {
      position: fixed;
      height: 100rpx;
      width: 100%;
      bottom: 0;
      .button {
        width: 100%;
        height: 100%;
        background: $my-main-color;
        color: #fff;
        @include flex-center;
        &__disabled {
          background: rgba(21, 57, 175, 0.8);
        }
      }

    }
}
</style>