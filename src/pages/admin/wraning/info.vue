<template>
  <view class="container">
      <u-sticky>
        <view class="filter-box">
            <!-- 关键词搜索框 -->
            <view class="filter-search">
              <u-search placeholder="输入预警对象查询" v-model="keyword" :show-action="false" @search="reload()" @blur="reload()"></u-search>
            </view>
            <view class="filter-tools">
                <mw-select :options="options" @confirm="searchConfirm"/>
            </view>
        </view>
      </u-sticky>
      <view class="list-container">
        <s-loading v-show="loading" />
        <trace-card v-for="(item, index) in list" :key="index" :item="item" :options="traceOptions" mode="warning"/>
      </view>
  </view>
</template>
<script>
import mwSelect from '@/compontens/mw-select/mw-select';
import traceCard from '@/compontens/mw-select/trace-card';
import sLoading from '@/compontens//s-loading';
import { listWarningRecord } from "@/utils/api.js";
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
          warningStatus: true,
          warningType: true,
          timestamp: true
        },
        traceOptions: {
          warningCheck: true,
          warning: true,
          warningDetail: true,
        },
        loading: false,
        pages: 0,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        departmentId: '', // 科室ID
        startTime: '',
        endTime: '',
        hospitalId: '', // 医院ID
        status: '', // 状态
        type: '', // 预警类型
        keyword: '', // 预警对象
        list: [],
    };
  },
  onLoad(option) {
      this.reload();
  },
  onPullDownRefresh() {
    this.reload();
  },
  onReachBottom() {
    this.next();
  },
  methods: {
      remove(index) {
        this.list.splice(index, 1);
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
        listWarningRecord({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          officeId: this.departmentId,
          status: this.status,
          type: this.type,
          startTime: this.startTime,
          endTime: this.endTime,
          keyword: this.keyword
        }).then(resp => {
            if (resp.code == 200) {
              this.list = [...this.list, ...resp.result.records];
              this.total = resp.result.total;
              this.pages = resp.result.pages;
            }
        }).catch(err => {}).finally(e => {
          this.loading = false;
          uni.stopPullDownRefresh();
        });
      },
      searchConfirm(e) {
        // 医院ID
        this.hospitalId = e.cascade;
        // 科室ID
        this.departmentId = e.subject;
        // 审核状态
        this.status = e.warningStatus;
        // 医废类型
        this.type = e.warningType;
        // 时间
        this.startTime = e.startTime;
        this.endTime = e.endTime;
        this.reload();
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
      // height: calc(100vh - 180rpx);
      background: #F3F5F7;
    }
}
</style>
