<template>
  <view class="container">
      <u-sticky>
        <view class="filter-box">
            <!-- 关键词搜索框 -->
            <view class="filter-search">
              <u-search placeholder="输入医废编号查询" v-model="code" :show-action="false" @search="reload()" @blur="reload()"></u-search>
            </view>
            <view class="filter-tools">
                <mw-select :default-value="mwSelectDefaultValue" :options="options" @confirm="searchConfirm"/>
            </view>
        </view>
      </u-sticky>
      <view class="list-container">
        <s-loading v-show="loading" />
        <view style="height: 70rpx;line-height: 70rpx;width: 100%;text-align: center;" v-show="!loading && list.length == 0">没有更多数据了</view>
        <trace-card v-for="(item, index) in list" :key="index" :item="item" @restore="restore(index)" :options="traceOptions" mode="restore"/>
      </view>
  </view>
</template>
<script>
import mwSelect from '@/compontens/mw-select';
import traceCard from '@/compontens/trace-card';
import sLoading from '@/compontens//s-loading';
import { getMedicalTraceListDelete } from "@/utils/api.js";
import mwSelectMixin from '@/mixins/mw-select.js';
export default {
  mixins: [ mwSelectMixin ],
  components:{
    mwSelect, traceCard, sLoading
  },
  data() {
    return {
        options: {
          cascade: true,
          status: true,
          waste: true,
          timestamp: true
        },
        traceOptions: {
          restore: true,
          detail: true
        },
        loading: false,
        pages: 0,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        auditStatus: '', // 审核状态
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
  onPullDownRefresh() {
    this.reload();
  },
  onReachBottom() {
    this.next();
  },
  methods: {
      restore(index) {
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
      async paginate() {
        this.loading = true;

        getMedicalTraceListDelete({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
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
        // 状态
        this.status = e.status;
        // 医废类型
        this.wasteType = e.waste;
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