<template>
  <view class="supply-create">
    <u-cell-group>
      <u-cell-item :title="formLabel.hospitalId" :arrow="true"  arrow-direction="right" :value="hospitalLabel" @click="showCascade()">
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
    <s-select-multi multi title="选择医废类型" v-model="wasteShow" :d-list="wasteList" @confirm="wasteCallback" :checked-list="wasteCheckedIndexList"/>
  </view>
</template>
<script>
import sSelect from '@/compontens/s-select';
import sSelectMulti from '@/compontens/s-select-multi';
import sPicker from '@/compontens/s-picker';
import sCheckbox from '@/compontens/s-checkbox';
import { getMyHospitalCascadeList, getWasteTypeList, editTransitConfig, addTransitConfig } from "@/utils/api.js";
import { mapState } from 'vuex';
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

      wasteList: [], // 医废类型列表

      // 表单显示列表
      hospitalLabel: '',
      wasteLabel: '',
      wasteCheckedIndexList: [], // 选中的索引列表
      hospitalIndexList: [], // 选中的医院列表
      hospitalIds: [], // 医院ID列表
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
        waste: '准运类型',
      },
      submitLoading: false,
      detail: {},
      cascadeData: {}
    };
  },
  onLoad(option) {
    this.loadWasteType();
    this.loadDetail();
  },
  computed: {
      ...mapState([
          'checkedNodes'
      ])
  },
  watch: {
      checkedNodes: function(n) {
          this.hospitalLabel = n.label;
          this.hospitalId = n.value;
          this.cascadeData = n;
      }
  },
  methods: {
    showCascade() {
        this.$toTree(Object.assign(this.cascadeData, {
          checkOnlyLeaf: true,
          onlyHospital: true
        }));
    },
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

        this.cascadeData = {
          label: detail.hospitalName,
          value: detail.hospitalId
        }
        this.wasteLabel = detail.wasteType;
        this.hospitalIds = detail.hospitalIdList.slice(1);
        uni.setNavigationBarTitle({
          title: '编辑出库配置'
        });
        return ;
      } else {
        uni.setNavigationBarTitle({
          title: '新增出库配置'
        });
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
                url: '/pages-mw/mw/outbound/setting'
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
                url: '/pages-mw/mw/outbound/setting'
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