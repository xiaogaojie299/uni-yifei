<template>
  <view class="supply-create">
    <view class="supply-create__content">
      <u-cell-group>
        <u-cell-item :title="formLabel.dateTime" :arrow="true" arrow-direction="right" :value="dateTime" @click="setShow('dateShow')"></u-cell-item>
        <u-cell-item :title="formLabel.hospitalId" :arrow="true"  arrow-direction="right" :value="hospitalLabel" @click="showCascade()">
        </u-cell-item>
        <u-cell-item :title="formLabel.departmentId" :arrow="true"  arrow-direction="right" :value="departmentLabel" @click="showDepartment()">
          <u-loading v-show="officeCascadeLoading" slot="icon"/>
        </u-cell-item>
        <u-cell-item :title="formLabel.officeUserId" :arrow="true"  arrow-direction="right" :value="officeUserLabel" @click="showDepartmentUser()">
          <u-loading v-show="officeUserLoading" slot="icon"/>
        </u-cell-item>
        <u-cell-item :title="formLabel.waste" :arrow="true"  arrow-direction="right" :value="wasteLabel" @click="setShow('wasteShow')">
          <u-loading v-show="wasteLoading" slot="icon"/>
        </u-cell-item>
        <u-cell-item :title="formLabel.createUserId" :arrow="true"  arrow-direction="right" :value="createUserLabel" @click="showCreateUser()">
          <u-loading v-show="officeUserLoading" slot="icon"/>
        </u-cell-item>
        <u-cell-item :title="formLabel.weight" :arrow="false" hover-class="none">
          <u-field
            placeholder="支持小数"
            v-model="weight"
            slot="right-icon"
            :clearable="false"
            disabled
            :border-bottom="false"
            input-align="right"
            :field-style="{padding: 0}"
            @click="weightShow = true"
          >
          </u-field>
        </u-cell-item>
        <u-cell-item :title="formLabel.desc" :arrow="false" hover-class="none">
          <u-field
            placeholder="不超过50个字符"
            slot="right-icon"
            v-model="desc"
            :clearable="false"
            :border-bottom="false"
            input-align="right"
            :field-style="{padding: 0}"
            :maxlength="50"
          >
          </u-field>
        </u-cell-item>
        <u-cell-item :title="formLabel.status" :arrow="true"  arrow-direction="right" :value="statusLabel" @click="setShow('statusShow')"></u-cell-item>
        <u-cell-item :title="formLabel.warehouse" :arrow="true"  arrow-direction="right" :value="warehouseLabel" @click="setShow('warehouseShow')" v-show="status >= 2">
          <u-loading v-show="warehouseLoading" slot="icon"/>
        </u-cell-item>
        <u-cell-item :title="formLabel.transport" :arrow="true"  arrow-direction="right" :value="transportLabel" @click="setShow('transportShow')" v-show="status == 3">
          <u-loading v-show="transportLoading" slot="icon"/>
        </u-cell-item>
      </u-cell-group>
    </view>
    <view class="supply-create__button__container">
      <view :class="{button: true, 'button__disabled': submitLoading}" @click="submit()">
        <u-loading style="margin-right: 10rpx" v-if="submitLoading" /> {{submitLoading ? '提交中' : '提交'}}
      </view>
    </view>
    <u-keyboard mode="number" @change="valChange" @backspace="backspace" v-model="weightShow"></u-keyboard>
    <s-picker v-model="dateShow" mode="time" @confirm="dateCallback" :params="dateParams" :default-time="dateTime"></s-picker>

    <s-select title="选择医废类型" v-model="wasteShow" :list="wasteList" @confirm="selectCallback($event, 'wasteLabel', 'waste', 'wasteList', 'wasteIndex')" :default-value="wasteIndex"></s-select>
    <s-select title="选择暂存间" v-model="warehouseShow" :list="warehouseList" @confirm="selectCallback($event, 'warehouseLabel', 'warehouse', 'warehouseList', 'warehouseIndex')" :default-value="warehouseIndex"></s-select>
    <s-select title="选择状态" v-model="statusShow" :list="statusList" @confirm="selectCallback($event, 'statusLabel', 'status', 'statusList', 'statusIndex')" :default-value="statusIndex"></s-select>
    <s-select title="选择运输人员" v-model="transportShow" :list="transportList" @confirm="selectCallback($event, 'transportLabel', 'transport', 'transportList', 'transportIndex')" :default-value="transportIndex"></s-select>
  </view>
</template>
<script>
import sSelect from '@/compontens/s-select';
import sPicker from '@/compontens/s-picker';
import sCheckbox from '@/compontens/s-checkbox';
import hospitalSelect from '@/compontens/hospital-select';
import { listSelect, getMyHospitalCascadeList, getMyOfficeCascadeList, getMyOfficeUserList, getWasteTypeList, addSupplementMedicalTrace, getMyWarehouseOfficeList } from "@/utils/api.js";
import { mapState } from 'vuex';
export default {
  components:{
    sSelect, sPicker, sCheckbox, hospitalSelect
  },
  computed: {
    ...mapState([
      'checkedNodes',
      'checkedDepartment',
      'checkedDepartmentUser'
    ])
  },
  watch: {
    waste(n, o) {
      this.departmentId && this.loadTransportList();
    },
    departmentId(n, o) {
      this.waste && this.loadTransportList();
    },
    checkedNodes: function(n) {
        if (n.value != this.hospitalId) {
          this.resetDepartment();
          this.resetOfficeCascade();
          this.resetWarehouse();
        }
        this.hospitalLabel = n.label;
        this.hospitalId = n.value;
        this.cascadeData = n;
    },
    checkedDepartment: function(n) {
        if (n.value != this.departmentId) {
          this.resetOfficeCascade();
          this.resetWarehouse();
        }
        this.departmentLabel = n.label;
        this.departmentId = n.value;
        this.departmentData = n;
        // 加载暂存间，提前加载，防止网络卡顿
        this.loadWarehouseOfficeList(this.departmentId);
    },
    checkedDepartmentUser: function(n) {
        if (this.isSelectDepartmentUser) {
          this.officeUserId = n.value;
          this.officeUserLabel = n.label;
          this.departmentUserData = n;
        } else {
          this.createUserId = n.value;
          this.createUserLabel = n.label;
          this.createUserData = n;
        }
    }
  },
  data() {
    return {
      departmentData: {},
      cascadeData: {},
      departmentUserData: {},
      createUserData: {},
      isSelectDepartmentUser: true, // true 科室人员 false 收集人员

      weightShow: false,
      hospitalShow: false, // 医院选择显示
      departmentShow: false, // 科室选择显示
      dateShow: false, // 时间选择
      officeUserShow: false, // 人员显示
      wasteShow: false, // 医废类型
      createUserShow: false, // 收集人员
      statusShow: false, // 状态
      warehouseShow: false, // 暂存间
      transportShow: false, // 运输人员

      hospitalLoading: false,
      wasteLoading: false,
      officeCascadeLoading: false,
      warehouseLoading: false,
      officeUserLoading: false,
      transportLoading: false, 

      // 时间选择器控制
      dateParams: {
          year: true,
          month: true,
          day: true,
          hour: true,
          minute: true,
          second: false
      },


      hospitalList: [], // 医院级联列表
      departmentList: [], // 科室列表
      officeUserList: [], // 人员列表
      wasteList: [], // 医废类型列表
      transportList: [], // 运输人员列表
      statusList: [
        {
          label: '未入库',
          value: 1
        },
        {
          label: '已入库',
          value: 2
        },
        {
          label: '已出库',
          value: 3
        }
      ],
      warehouseList: [], // 暂存间列表


      // 表单显示列表
      hospitalLabel: '',
      departmentLabel: '',
      officeUserLabel: '',
      wasteLabel: '',
      createUserLabel: '',
      statusLabel: '',
      warehouseLabel: '',
      transportLabel: '',

      // 选择组件的回显索引
      hospitalIndex: [],
      officeUserIndex: [],
      createUserIndex: [],
      statusIndex: [],
      wasteIndex: [],
      warehouseIndex: [],
      departmentIndex: [],
      transportIndex: [],

      // 表单提交字段
      hospitalId: '',
      departmentId: '',
      dateTime: '',
      officeUserId: '',
      createUserId: '',
      status: '',
      waste: '',
      weight: '',
      desc: '',
      warehouse: '',
      transport: '',
      formLabel: {
        dateTime: '收集时间',
        hospitalId: '医院名称',
        departmentId: '科室名称',
        officeUserId: '科室人员',
        waste: '医废类型',
        createUserId: '收集人员',
        weight: '医废重量(kg)',
        desc: '备注',
        status: '状态',
        warehouse: '暂存间',
        transport: '运输人员'
      },
      submitLoading: false,
    };
  },
  onLoad(option) {
    this.loadWasteType();
  },
  methods: {
    showCascade() {
        this.$toTree(Object.assign(this.cascadeData, {
          checkOnlyLeaf: true,
          onlyHospital: true
        }));
    },
    showDepartment() {
        if (!this.hospitalId) {
          uni.showToast({
            title: '请先选择医院',
            icon: 'none'
          });
          return ;
        }
        this.$toTree(Object.assign(this.departmentData, {
          checkOnlyLeaf: true,
          hospitalId: this.hospitalId
        }));
    },
    showDepartmentUser() {
        if (!this.departmentId) {
          uni.showToast({
            title: '请先选择科室',
            icon: 'none'
          });
          return ;
        }
        this.$toTree(Object.assign(this.departmentUserData, {
          checkOnlyLeaf: true,
          departmentId: this.departmentId
        }));
    },
    showCreateUser() {
        this.isSelectDepartmentUser = false;
        if (!this.departmentId) {
          uni.showToast({
            title: '请先选择科室',
            icon: 'none'
          });
          return ;
        }
        this.$toTree(Object.assign(this.createUserData, {
          checkOnlyLeaf: true,
          departmentId: this.departmentId
        }));
    },
    // 按键被点击(点击退格键不会触发此事件)
    valChange(val) {
      if (val == '.') {
          if (this.defaultValue.indexOf('.') > -1) {
          return ;
          }
      }
      // 将每次按键的值拼接到value变量中，注意+=写法
      this.weight += val;
    },
    // 退格键被点击
    backspace() {
      // 删除value的最后一个字符
      if(this.weight.length) this.weight = this.weight.substr(0, this.weight.length - 1);
    },
      
    // 时间回调事件
    dateCallback(e) {
      this.dateTime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':00';
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
    // 清空科室选择
    resetDepartment() {
      this.departmentId = '';
      this.departmentLabel = '';
    },
    // 清空科室&收集人员
    resetOfficeCascade() {
      this.createUserLabel = '';
      this.createUserId = '';
      this.officeUserId = '';
      this.officeUserLabel = '';
    },
    // 计算属性
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
    // 清空科室选择
    resetWarehouse() {
      this.warehouse = '';
      this.warehouseLabel = '';
    },
    // 获取暂存间列表
    loadWarehouseOfficeList(officeId) {
      this.warehouseLoading = true;
      getMyWarehouseOfficeList({
            officeId
      }).then(resp => {
        if (resp.code == 200) {
          this.warehouseList = resp.result || [];
        }
      }).catch(err => {}).finally(e => {
        this.warehouseLoading = false;
      });
    },
    // 获取运输人员列表，必须是已出库&科室ID&医废类型才可查询
    loadTransportList() {
      listSelect({
        parentId: this.departmentId, // 科室ID
        wasteType: this.waste, // 医废类型
      }).then(resp => {
        if (resp.code == 200) {
          this.transportList = resp.result.map(item => {
            return {
              label: [item.engineDriver, item.licensePlate, item.transitCompany].join('/'),
              value: item.id
            }
          });
        }
      });
    },
    // 共用回调，labelKey 文本的键， valueKey 值的键， listKey 列表的键， indexKey 索引的键
    selectCallback(e, labelKey, valueKey, listKey, indexKey) {
      let result = e[0];
      this.$set(this, labelKey, result.label);
      this.$set(this, valueKey, result.value);
      if (valueKey == 'status' && result.value != 2) {
        this.resetWarehouse();
      }

      // 开始设置Index索引
      let index = this.indexCalc(e, this.$data[listKey]);
      console.log(result, index);
      this.$set(this, indexKey, index);
    },
    setShow(key) {
      // 如果是展示科室列表，应先选择医院
      if ((key == 'warehouseShow' || key == 'transportShow') && !this.departmentId) {
        uni.showToast({
          title: '请先选择科室',
          icon: 'none'
        });
        return ;
      } else if (key == 'transportShow' && !this.waste) {
        uni.showToast({
          title: '请先选择医废类型',
          icon: 'none'
        });
        return ;
      }
      this.$set(this, key, true);
    },
    // 这里不能用计步器，只能用个正则解决下了
    weightCheck() {
      let result = this.$u.test.number(this.weight)
      if (!result) {
        uni.showToast({
          title: '在' + this.formLabel.weight + '处应输入数字(支持小数)',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    submit() {
      if (this.submitLoading) {
        return ;
      }
      for (let item in this.formLabel) {
        if (item != 'desc' && !this.$data[item]) {
          // 只有状态小于2的时候，才检查暂存间是否选中
          if (item == 'warehouse' && this.status < 2) {
            // 过滤
          } else 
          // 只有状态==3的时候，才检查运输人员是否选中
          if (item == 'transport' && this.status != 3) {

          } else {
            uni.showToast({
              title: this.formLabel[item] + '不合法',
              icon: 'none'
            })
            return ;
          }
        }
      }
      // 再次检查数字是否合法
      if (!this.weightCheck()) {
        return ;
      }
      this.submitLoading = true;
      // 开始提交
      addSupplementMedicalTrace({
        createTime: this.dateTime,
        createBy: this.createUserId,
        departmentId: this.departmentId,
        departmentUserId: this.officeUserId,
        description: this.desc,
        hospitalId: this.hospitalId,
        status: this.status,
        wasteType: this.waste,
        weight: parseFloat(this.weight),
        warehouseId: this.warehouse,
        transitConfigId: this.transport
      }).then(resp => {
        if (resp.code == 200) {
          uni.showToast({
            title: '提交成功',
            icon: 'none'
          })
          setTimeout(() => {
            uni.setStorageSync('willRefresh', 1);
            uni.navigateBack();
          }, 800);
        }
      }).catch(err => {}).finally(e => {
        this.submitLoading = false;
      }); 
    }
  }
};
</script>
<style lang="scss" scoped>
.supply-create {
  .u-field {
    padding: 0rpx !important;
  }
  &__content {
    padding-bottom: 120rpx;
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