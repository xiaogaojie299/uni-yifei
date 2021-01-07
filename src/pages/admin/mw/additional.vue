<template>
  <view class="container">
      <u-sticky>
        <view class="filter-box">
            <!-- 关键词搜索框 -->
            <view class="filter-search">
              <u-search placeholder="输入医废编号、操作人员查询" v-model="code" :show-action="false" @search="reload()" @blur="reload()"></u-search>
            </view>
            <view class="filter-tools">
                <mw-select :options="options" @confirm="searchConfirm"/>
            </view>
        </view>
      </u-sticky>
      <view class="list-container">
        <s-loading v-show="loading" />
        <trace-card v-for="(item, index) in list" :key="index" :item="item" @audit="audit($event, index)" :options="traceOptions" mode="supply"/>
      </view>
      <view class="button-container">
        <view class="button" @click="create()">新增补录</view>
      </view>
  </view>
</template>
<script>
import mwSelect from '@/compontens/mw-select/mw-select';
import traceCard from '@/compontens/mw-select/trace-card';
import sLoading from '@/compontens//s-loading';
import { listSupplementMedicalTrace } from "@/utils/api.js";
export default {
  components:{
    mwSelect, traceCard, sLoading
  },
  data() {
    return {
        options: {
          cascade: true,
          department: true,
          subject: true,
          status: true,
          waste: true,
          timestamp: true
        },
        traceOptions: {
          audit: true,
          detail: true
        },
        loading: false,
        pages: 0,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        auditStatus: '', // 审核状态
        departmentId: '', // 科室ID
        startTime: '',
        endTime: '',
        hospitalId: '', // 医院ID
        status: '', // 状态
        transitCompany: '', // 搜索关键词
        transitConfigId: 0, // 出库配置ID
        wasteType: '', // 医废类型
        code: '',
        list: [],
    };
  },
  onLoad(option) {
    this.reload();
  },
  onShow() {
  },
  onPullDownRefresh() {
    this.reload();
  },
  onReachBottom() {
    this.next();
  },
  methods: {
      audit(e, index) {
        this.$set(this.list[index], 'auditStatus', e.flag ? 2 : 3);
      },
      reload() {
        this.pageNo = 1;
        this.pageSize = 10;
        this.list = [];
        this.total = 0;
        this.pages = 0;
        this.paginate();
      },
      // 加载下一页
      next() {
        if (this.pageNo >= this.pages) {
          uni.showToast({
            title: '没有更多了',
            icon: 'none'
          });
          return ;
        }

        this.pageNo++;
        this.paginate();
      },
      // 加载数据
      paginate() {
        this.loading = true;
        listSupplementMedicalTrace({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          departmentId: this.departmentId,
          status: this.status,
          wasteType: this.wasteType,
          startTime: this.startTime,
          endTime: this.endTime,
          code: this.code
        }).then(resp => {
            if (resp.code == 200) {
              this.list = [...this.list, ...resp.result.records];
              this.total = resp.result.total;
              this.pages = resp.result.pages;
            }
        }).catch(err => {}).finally(e => {
          this.loading = false;
          uni.stopPullDownRefresh();
        })
      },
      searchConfirm(e) {
        // 医院ID
        this.hospitalId = e.cascade;
        // 科室ID
        this.departmentId = e.subject;
        // 审核状态
        this.status = e.status;
        // 医废类型
        this.wasteType = e.waste;
        // 时间
        this.startTime = e.startTime;
        this.endTime = e.endTime;
        this.reload();
      },
      // 新增补录
      create() {
        uni.navigateTo({
          url: '/pages/admin/mw/supply-create'
        });
      }
  }
};
</script>
<style lang="scss" scoped>
page {
  overflow: hidden;
}
.container {
    .filter-box {
        background: #1539AF;
        height: 180rpx;
        width: 100%;
        .filter-search {
            margin: 0rpx 28rpx;
            height: 80rpx;
        }
        .filter-tools {

        }
    }
    .list-container {
      min-height: 100vh;
      margin-bottom: 100rpx;
      // height: calc(100vh - 280rpx);
      background: #F3F5F7;
    }
    .button-container {
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
      }
    }
}
</style>