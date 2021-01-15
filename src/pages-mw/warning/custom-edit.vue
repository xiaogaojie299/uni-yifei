<template>
  <view class="warning-setting-custom-edit">
    <u-cell-group>
      <u-cell-item title="医院" :arrow="true"  arrow-direction="right" :value="hospitalLabel" @click="showHospital">
        <u-loading v-show="hospitalLoading" slot="icon"/>
      </u-cell-item>
      <u-cell-item title="科室" :arrow="true"  arrow-direction="right" :value="departmentLabel" @click="showDepartment" v-if="type == 1">
        <u-loading v-show="departmentLoading" slot="icon"/>
      </u-cell-item>
      <u-cell-item title="类型" :arrow="true"  arrow-direction="right" :value="wasteLabel" @click="showWaste" v-if="type == 4">
        <u-loading v-show="wasteLoading" slot="icon"/>
      </u-cell-item>
    </u-cell-group>
    <u-field label="设置超时时长(天)" label-width="220" input-align="right" type="number" v-model="defaultValue" :border-bottom="true" placeholder="填写时长(纯数字，不能有小数)" :clearable="false" @blur="numberCheck()"/>
    <view class="warning-setting-custom-edit__button__container">
      <view :class="{button: true, 'button__disabled': submitLoading}" @click="submit()">
        <u-loading style="margin-right: 10rpx" v-if="submitLoading" /> {{submitLoading ? '提交中' : '提交'}}
      </view>
    </view>
    <hospital-select title="选择医院" v-model="hospitalShow" @confirm="hospitalCallback" :default-value="hospitalIndex" :default-ids="hospitalIds" @loading="hospitalLoading = true" @loaded="hospitalLoading = false"/>
    <hospital-select title="选择科室" v-model="departmentShow" @confirm="departmentCallback" :default-value="departmentIndex" :default-ids="departmentIds" :hospital-id="hospitalId" @loading="departmentLoading = true" @loaded="departmentLoading = false"/>
    <s-select title="医废类型" v-model="wasteShow" :list="wasteList" @confirm="selectCallback($event, 'wasteLabel', 'waste', 'wasteList', 'wasteIndex')" :default-value="wasteIndex"></s-select>
  </view>
</template>
<script>
import { addWarningConfigItem, editWarningConfigItem, getWasteTypeList } from "@/utils/api.js";
import HospitalSelect from '@/compontens/hospital-select';
import sField from '@/compontens/s-field';
import sSelect from '@/compontens/s-select';
export default {
  components:{
    HospitalSelect, sField, sSelect
  },
  data() {
    return {
      hospitalShow: false, // 医院选择显示
      departmentShow: false, // 科室选择显示
      wasteShow: false,

      hospitalLoading: false,
      departmentLoading: false,
      submitLoading: false,
      wasteLoading: false,

      wasteList: [],

      // 表单显示列表
      hospitalLabel: '',
      departmentLabel: '',
      wasteLabel: '',

      // 选择组件的回显索引
      departmentIndex: [],
      hospitalIndex: [],
      wasteIndex: [],

      hospitalIds: [],
      departmentIds: [],

      // 表单提交字段
      hospitalId: '',
      departmentId: '',
      submitLoading: false,

      detail: {}, // 当前自定义设置的详情

      // 提交的其他数据
      type: 0,
      id: '',
      defaultValue: '',
      waste: '',

      // 是否禁用
      disabled: true,
    };
  },
  onLoad(option) {
    this.type = option.type;
    this.load();
  },
  methods: {
    indexCalc(e, tmpData) {
        let cascadeIndex = [];
        for (let i in e) {
            let index = tmpData.findIndex(item => item.value == e[i].value);
            if (index > -1) {
                cascadeIndex.push(index);
                tmpData = tmpData[index].children;
            }
        }
        return cascadeIndex;
    },
    // 共用回调，labelKey 文本的键， valueKey 值的键， listKey 列表的键， indexKey 索引的键
    selectCallback(e, labelKey, valueKey, listKey, indexKey) {
      let result = e[0];
      this.$set(this, labelKey, result.label);
      this.$set(this, valueKey, result.value);

      // 开始设置Index索引
      let index = this.indexCalc(e, this.$data[listKey]);
      this.$set(this, indexKey, index);
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
      showHospital() {
        if (this.disabled) {
          return ;
        }
        this.hospitalShow = true;
      },
      showDepartment() {
        if (this.disabled) {
          return ;
        }
        if (!this.hospitalId) {
          uni.showToast({
            title: '请先选择医院',
            icon: 'none'
          })
          return ;
        }
        this.departmentShow = true;
      },
      showWaste() {
        console.log(this.disabled);
        if (this.disabled) {
          return ;
        }
        this.wasteShow = true;
      },
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
        let dialogText = (isDigits ? '时长' : '重量') + '应该为一个' + (isDigits ? '正整数' : '正数');
        if (!result) {
            uni.showToast({
                title: dialogText,
                icon: 'none'
            });
            return false;
        }
        return true;
      },
      load() {
        let detail = uni.getStorageSync('cache:warning-setting:custom');
        if (detail) {
          this.detail = detail;
          this.hospitalId = detail.customHospitalId;
          this.hospitalLabel = detail.customHospitalName;
          this.departmentId = detail.customOfficeId;
          this.departmentLabel = detail.customOfficeName;
          this.defaultValue = detail.customValue;
          this.hospitalIds = detail.hospitalIdList.slice(1) || [];
          this.departmentIds = detail.officeIdList ? (detail.officeIdList.length > 5 ? detail.officeIdList.slice(5) : []) : [];
          this.type = detail.type;
          this.waste = detail.wasteType;
          this.wasteLabel = detail.wasteTypeName;
          this.id = detail.id;
          uni.setNavigationBarTitle({
            title: '编辑自定义时长'
          });
        } else {
          this.disabled = false;
          uni.setNavigationBarTitle({
            title: '新增自定义时长'
          });
        }
        this.loadWasteType();
      },
      departmentCallback(e) {
          if (e.e.length > 0) {
              let department = e.e[e.e.length - 1];
              this.departmentLabel = department.label;
              this.departmentId = department.value;
          }
      },
      hospitalCallback(e) {
          if (e.e.length > 0) {
              let hospital = e.e[e.e.length - 1];
              this.hospitalLabel = hospital.label;
              this.hospitalId = hospital.value;
              this.resetDepartment();
          }
      },
      resetDepartment() {
        this.departmentId = '';
        this.departmentLabel = '';
        this.departmentIds = [];
      },
      submit() {
        // 检查数字
        if (!this.numberCheck()) {
          return ;
        }
        if (!this.hospitalId) {
          uni.showToast({
            title: '请选择医院',
            icon: 'none'
          });
          return ;
        }
        this.submitLoading = true;
        let data = {
            customHospitalId: this.hospitalId,
            customValue: this.defaultValue,
            type: this.type
        };
        if (this.type == 1) {
          // 如果是1，必须选择科室
          if (!this.departmentId) {
            uni.showToast({
              title: '请选择科室',
              icon: 'none'
            });
            return ;
          }
          data = Object.assign(data, {
            customOfficeId: this.departmentId,
          });
        } else if (this.type == 4) {
          // 如果是4，必须选择类型
          if (!this.waste) {
            uni.showToast({
              title: '请选择类型',
              icon: 'none'
            });
            return ;
          }
          data = Object.assign(data, {
            wasteType: this.waste,
          });
        }
        if (!this.id) {
          addWarningConfigItem(data).then(resp => {
            if (resp.code == 200) {
              // 修改成功
              uni.showToast({
                title: '添加成功',
                icon: 'none'
              })
              setTimeout(function() {
                uni.setStorageSync('willRefresh', 1);
                uni.navigateBack();
              }, 800);
            }
          }).finally(e => {
            this.submitLoading = false;
          });
        } else {
          data = Object.assign(data, {
            id: this.id
          });
          editWarningConfigItem(data).then(resp => {
            if (resp.code == 200) {
              // 修改成功
              uni.showToast({
                title: '修改成功',
                icon: 'none'
              })
              setTimeout(function() {
                uni.navigateBack();
              }, 800);
            }
          }).finally(e => {
            this.submitLoading = false;
          });
        }

      }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .u-cell_title {
  font-weight: 500;
  font-size: 32rpx;
}
/deep/ .u-cell__value {
  font-weight: 500;
  font-size: 32rpx;
}
.warning-setting-custom-edit {
  .u-field {
    padding: 0rpx !important;
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