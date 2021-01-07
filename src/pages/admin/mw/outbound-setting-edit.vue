<template>
  <view class="supply-create">
    <u-cell-group>
      <u-cell-item :title="formLabel.hospitalId" :arrow="true"  arrow-direction="right" :value="hospitalLabel" @click="setShow('hospitalShow')">
        <u-loading v-show="hospitalLoading" slot="icon"/>
      </u-cell-item>
      <u-cell-item :title="formLabel.engineDriver" :arrow="false" hover-class="none">
        <u-field
			    placeholder="不超过20个字符"
          slot="right-icon"
          v-model="engineDriver"
          :clearable="false"
          :border-bottom="false"
          input-align="right"
          :field-style="{padding: 0}"
          :maxlength="20"
        >
        </u-field>
      </u-cell-item>
      <u-cell-item :title="formLabel.licensePlate" :arrow="false" hover-class="none">
        <u-field
			    placeholder="不超过20个字符"
          slot="right-icon"
          v-model="licensePlate"
          :clearable="false"
          :border-bottom="false"
          input-align="right"
          :field-style="{padding: 0}"
          :maxlength="20"
        >
        </u-field>
      </u-cell-item>
      <u-cell-item :title="formLabel.transitCompany" :arrow="false" hover-class="none">
        <u-field
			    placeholder="不超过20个字符"
          slot="right-icon"
          v-model="transitCompany"
          :clearable="false"
          :border-bottom="false"
          input-align="right"
          :field-style="{padding: 0}"
          :maxlength="20"
        >
        </u-field>
      </u-cell-item>
      <u-cell-item :title="formLabel.waste" :arrow="true"  arrow-direction="right" :value="wasteLabel" @click="setShow('wasteShow')">
        <u-loading v-show="wasteLoading" slot="icon"/>
      </u-cell-item>
    </u-cell-group>
    <view class="supply-create__button__container">
      <view :class="{button: true, 'button__disabled': submitLoading}" @click="submit()" :disabled="true">
        <u-loading style="margin-right: 10rpx" v-if="submitLoading" /> {{submitLoading ? '提交中' : '提交'}}
      </view>
    </view>
    <s-select mode="mutil-column-auto" title="选择医院" v-model="hospitalShow" :list="hospitalList" @confirm="hospitalCallback" :default-value="hospitalIndexList"></s-select>
    <s-select-multi multi title="选择医废类型" v-model="wasteShow" :d-list="wasteList" @confirm="wasteCallback" :checked-list="wasteCheckedIndexList"/>
  </view>
</template>
<script>
import sSelect from '@/compontens/mw-select/s-select';
import sSelectMulti from '@/compontens/mw-select/s-select-multi';
import sPicker from '@/compontens/mw-select/s-picker';
import sCheckbox from '@/compontens/mw-select/s-checkbox';
import { getMyHospitalCascadeList, getWasteTypeList, editTransitConfig, addTransitConfig } from "@/utils/api.js";
export default {
  components:{
    sSelect, sPicker, sCheckbox, sSelectMulti
  },
  data() {
    return {
      hospitalShow: false, // 医院选择显示
      wasteShow: false, // 医废类型

      hospitalLoading: false, // 医院加载
      wasteLoading: false, // 医废类型加载

      hospitalList: [], // 医院级联列表
      wasteList: [], // 医废类型列表

      // 表单显示列表
      hospitalLabel: '',
      wasteLabel: '',
      wasteCheckedIndexList: [], // 选中的索引列表
      hospitalIndexList: [], // 选中的医院列表

      // 表单提交字段
      id: '',
      hospitalId: '',
      waste: '',
      engineDriver: '',
      licensePlate: '',
      transitCompany: '',
      formLabel: {
        hospitalId: '医院名称',
        engineDriver: '运输人员',
        licensePlate: '车牌号',
        transitCompany: '运输单位',
        waste: '医废类型',
      },
      submitLoading: false,
      detail: {}
    };
  },
  onLoad(option) {
    this.loadHospitalHospital();
    this.loadWasteType();
    this.loadDetail();
  },
  methods: {
    // 检查是否修改还是添加
    loadDetail() {
      let detail = uni.getStorageSync('cache:outbound:detail');
      // 如果获取到详情了
      if (detail) {
        this.detail = detail;
        // 开始初始化数据
        this.hospitalId = detail.hospitalId;
        this.waste = detail.wasteTypeId;
        this.engineDriver = detail.engineDriver;
        this.licensePlate = detail.licensePlate;
        this.transitCompany = detail.transitCompany;
        this.id = detail.id;

        this.hospitalLabel = detail.hospitalName;
        this.wasteLabel = detail.wasteType;
        return ;
      }
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

          // 考虑到编辑数据的时候，可能会出现异步的问题，所以在加载完列表数据后，再去渲染文案
          if (this.detail.wasteTypeId || false) {
            let wasteIds = this.detail.wasteTypeId.split(',');
            for (let i in wasteIds) {
              let index = this.wasteList.findIndex(item => item.value == parseInt(wasteIds[i]));
              if (index > -1) {
                this.wasteCheckedIndexList.push(index);
              }
            }
          }
        }
      }).catch(err => {}).finally(e => {
        this.wasteLoading = false;
      });
    },
    // 计算属性
    cascadeIndexCalc(e, isIndex) {
        let cascadeIndex = [];
        let tmpData = this.hospitalList;
        for (let i in e) {
            let index = tmpData.findIndex(item => item.value == (!isIndex ? e[i].value : e[i]));
            if (index > -1) {
                cascadeIndex.push(index);
                tmpData = tmpData[index].children;
            }
        }
        this.hospitalIndexList = cascadeIndex;
    },
    // 获取医院列表
    loadHospitalHospital() {
      this.hospitalLoading = true;
      getMyHospitalCascadeList().then(resp => {
        if (resp.code == 200) {
          this.hospitalList = resp.result[0].children || [];
          
          // 计算索引
          let hospitalIdList = this.detail.hospitalIdList || [];
          if (hospitalIdList.length == 5) {
            hospitalIdList = hospitalIdList.slice(1);
            this.cascadeIndexCalc(hospitalIdList, true);
          }
        }
      }).catch(err => {}).finally(e => {
        this.hospitalLoading = false;
      });
    },
    // 医院选择回调事件
    hospitalCallback(e) {
      let hospital = e[e.length - 1];
      this.hospitalLabel = hospital.label;
      this.hospitalId = hospital.value;

      // 计算索引
      this.cascadeIndexCalc(e, false);
    },
    wasteCallback(e) {
      let _this = this;
      this.wasteCheckedIndexList = e.checked;
      let waste = [];
      let wasteLabel = [];
      e.checked.map(item => {
        waste.push(_this.wasteList[item].value);
        wasteLabel.push(_this.wasteList[item].label);
      });
      this.waste = waste.join(',');
      this.wasteLabel = wasteLabel.join('/');
    },
    selectCallback(e, labelKey, valueKey) {
      let result = e[0];
      this.$set(this, labelKey, result.label);
      this.$set(this, valueKey, result.value);
    },
    setShow(key) {
      this.$set(this, key, true);
    },
    submit() {
      if (this.submitLoading) {
        return ;
      }
      for (let item in this.formLabel) {
        if (!this.$data[item]) {
            uni.showToast({
              title: this.formLabel[item] + '不合法',
              icon: 'none'
            })
            return ;
        }
      }
      this.submitLoading = true;

      if (this.id) {
        // 开始提交
        editTransitConfig({
          id: this.id,
          engineDriver: this.engineDriver,
          hospitalId: this.hospitalId,
          licensePlate: this.licensePlate,
          transitCompany: this.transitCompany,
          wasteType: this.waste,
          id: this.detail.id
        }).then(resp => {
          if (resp.code == 200) {
            uni.showToast({
              title: '提交成功',
              icon: 'none'
            })
            // 清除
            uni.removeStorageSync('cache:outbound:detail');
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/admin/mw/outbound-setting'
              });
            }, 800);
          }
        }).catch(err => {}).finally(e => {
          this.submitLoading = false;
        }); 
      } else {
        // 开始提交
        addTransitConfig({
          engineDriver: this.engineDriver,
          hospitalId: this.hospitalId,
          licensePlate: this.licensePlate,
          transitCompany: this.transitCompany,
          wasteType: this.waste,
          id: this.detail.id
        }).then(resp => {
          if (resp.code == 200) {
            uni.showToast({
              title: '提交成功',
              icon: 'none'
            });
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/admin/mw/outbound-setting'
              });
            }, 800);
          }
        }).catch(err => {}).finally(e => {
          this.submitLoading = false;
        }); 
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.supply-create {
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