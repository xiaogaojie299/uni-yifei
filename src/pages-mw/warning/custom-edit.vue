<template>
  <view class="warning-setting-custom-edit">
    <u-cell-group>
      <u-cell-item title="医院" :arrow="true"  arrow-direction="right" :value="hospitalLabel" @click="hospitalShow = true">
        <u-loading v-show="hospitalLoading" slot="icon"/>
      </u-cell-item>
      <u-cell-item title="科室" :arrow="true"  arrow-direction="right" :value="departmentLabel" @click="departmentShow = true">
        <u-loading v-show="departmentLoading" slot="icon"/>
      </u-cell-item>
    </u-cell-group>
    <s-field label="设置超时时长(天)" v-model="defaultValue" :border-bottom="true" placeholder="填写时长(纯数字，不能有小数)" :clearable="false" @blur="numberCheck()"/>
    <view class="warning-setting-custom-edit__button__container">
      <view :class="{button: true, 'button__disabled': submitLoading}" @click="submit()">
        <u-loading style="margin-right: 10rpx" v-if="submitLoading" /> {{submitLoading ? '提交中' : '提交'}}
      </view>
    </view>
    <hospital-select title="选择医院" v-model="hospitalShow" @confirm="hospitalCallback" :default-value="hospitalIndex" :default-ids="hospitalIds" @loading="hospitalLoading = true" @loaded="hospitalLoading = false"/>
    <hospital-select title="选择科室" v-model="departmentShow" @confirm="departmentCallback" :default-value="departmentIndex" :default-ids="departmentIds" :hospital-id="hospitalId" @loading="departmentLoading = true" @loaded="departmentLoading = false"/>
  </view>
</template>
<script>
import { addWarningConfigItem, editWarningConfigItem } from "@/utils/api.js";
import HospitalSelect from '@/compontens/hospital-select';
import sField from '@/compontens/s-field';
export default {
  components:{
    HospitalSelect, sField
  },
  data() {
    return {
      hospitalShow: false, // 医院选择显示
      departmentShow: false, // 科室选择显示

      hospitalLoading: false,
      departmentLoading: false,
      submitLoading: false,

      // 表单显示列表
      hospitalLabel: '',
      departmentLabel: '',

      // 选择组件的回显索引
      departmentIndex: [],
      hospitalIndex: [],

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

    };
  },
  onLoad(option) {
    this.load();
  },
  methods: {
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
          this.hospitalIds = detail.hospitalIdList.slice(1);
          this.departmentIds = detail.officeIdList.slice(5);
          this.type = detail.type;
          this.id = detail.id;
        }
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
        }
        if (!this.departmentId) {
          uni.showToast({
            title: '请选择科室',
            icon: 'none'
          });
        }
        this.submitLoading = true;
        if (!this.id) {
          addWarningConfigItem({
            customHospitalId: this.hospitalId,
            customOfficeId: this.departmentId,
            customValue: this.defaultValue,
            type: this.type
          }).then(resp => {
            if (resp.code == 200) {
              // 修改成功
              uni.showToast({
                title: '添加成功',
                icon: 'none'
              })
              setTimeout(function() {
                uni.navigateBack();
              }, 800);
            }
          }).finally(e => {
            this.submitLoading = false;
          });
        } else {
          editWarningConfigItem({
            customHospitalId: this.hospitalId,
            customOfficeId: this.departmentId,
            customValue: this.defaultValue,
            type: this.type,
            id: this.id
          }).then(resp => {
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