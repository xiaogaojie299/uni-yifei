<template>
  <view class="container">
      <u-sticky>
        <view class="filter-box">
            <!-- 关键词搜索框 -->
            <view class="filter-search">
              <u-search placeholder="输入医废编号、车牌号、运输单位查询" v-model="keyWord" :show-action="false" @search="reload()" @blur="reload()"></u-search>
            </view>
            <view class="filter-tools">
                <mw-select :default-value="mwSelectDefaultValue" :options="options" @confirm="searchConfirm"/>
            </view>
        </view>
      </u-sticky>
      <view class="list-container">
        <s-loading v-show="loading" />
        <view style="height: 70rpx;line-height: 70rpx;width: 100%;text-align: center;" v-show="list.length == 0 && !loading">没有更多数据了</view>
        <outbound-setting-card v-for="(item, index) in list" :key="index" :item="item" @remove="remove(index)" />
      </view>
      <view class="button-container" v-if="canEdit">
        <view class="button" @click="create()">新增配置</view>
      </view>
  </view>
</template>
<script>
import mwSelect from '@/compontens/mw-select';
import outboundSettingCard from '@/compontens/outbound-setting-card';
import sLoading from '@/compontens/s-loading';
import { listTransitConfig } from "@/utils/api.js";
import mwSelectMixin from '@/mixins/mw-select.js';
export default {
  mixins: [ mwSelectMixin ],
  components:{
    mwSelect, outboundSettingCard, sLoading
  },
  data() {
    return {
        options: {
          cascade: true,
          department: false,
          subject: false,
          status: false,
          waste: false,
          timestamp: false
        },
        loading: false,
        pages: 0,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        hospitalId: '', // 医院ID
        keyWord: '',
        list: [],
    };
  },
  computed: {
    canEdit() {
      return this.$util.checkPermission('outbound:setting:edit')
    },
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
      async paginate() {
        this.loading = true;

        listTransitConfig({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
          keyWord: this.keyWord, // 车牌号
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
        this.reload();
      },
      create() {
          // 清除
          uni.removeStorageSync('cache:outbound:detail');
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages-mw/mw/outbound/setting-edit'
            });
          }, 800);
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