<template>
  <view class="container">
    <u-sticky>
      <view class="header">
        <view class="header-cont my-box">
          <!-- 顶部input -->
          <view class="ipt-box">
            <!-- icon -->
            <img src="@/static/images/search.png" alt="" />
            <!-- input框 -->
            <input
              type="text"
              @confirm="search()"
              confirm-type="search"
              v-model="devIdno"
              placeholder="输入监控设备编号"
            />
          </view>
          <!-- 选择组织 -->
          <view class="checkDrop-box flex-ver-center">
            <view @tap="handleHospitalShow" class="checkDrop">
              <input
                placeholder="选择组织"
                :value="selectTree.label"
                type="text"
                disabled
              />
              <!-- <img src="@/static/images/down_arrow.png" alt=""> -->
            </view>
          </view>
        </view>
      </view>
    </u-sticky>
    <!-- 中间主体列表 -->
    <view class="main">
      <view class="hspList" v-for="(item, index) in monitorList" :key="index">
        <view class="hspList-top my-box">
          <view class="">
            <text class="label font-w-400">医院名称：</text>
            <text class="label font-w-500">{{ item.hospitalName }}</text>
          </view>
          <view class="">
            <text class="label font-w-400">监控设备名称：</text>
            <text class="label font-w-500">{{ item.deviceName }}</text>
          </view>
          <view class="">
            <text class="label font-w-400">监控设备编号：</text>
            <text class="label font-w-500">{{ item.devIdno }}</text>
          </view>
          <view class="">
            <text class="label font-w-400">通道数：</text>
            <text class="label font-w-500">{{ item.channelNum }}</text>
          </view>
          <view class="">
            <text class="label font-w-400">自动关闭时间(分钟)：</text>
            <text class="label font-w-500">{{ item.autoCloseSecond }}</text>
          </view>
        </view>
        <view class="hspList-bottom my-box">
          <view class="flex">
            <view @tap="goDetail(item)" class="btn compile-btn flex-ver-center">
              编辑
            </view>
            <view @tap="del(item.id)" class="btn del-btn ml-20 flex-ver-center">
              删除
            </view>
          </view>
        </view>
      </view>
    </view>

    <view @tap="goAdd" class="footer flex-ver-center"> 新增监控设备 </view>
    <u-toast ref="uToast" />
    <!-- 选择医院名称 -->
    <!-- <area-drop-down ref="childMethod" :list="areaList" @selectRow="selectRow"></area-drop-down> -->
  </view>
</template>
<script>
import { monitoringList, deleteMonitor } from "@/utils/api";
import areaDropDown from "@/compontens/my-drop-down/area-drop-down";
export default {
  data() {
    return {
      monitorList: [],
      areaList: {}, //医院列表
      selectHos: {}, //选择的医院
      selectTree: {},
      pageNo: 1,
      devIdno: null, // 监控设备编号
      isRemake: false, // 判断返回的监控列表是追加还是重新赋值
    };
  },
  components: {
    areaDropDown,
  },
  created() {
    this.init();
  },
  onReachBottom: function () {
    //上拉触底加载更多
    this.pageNo++;
    this.isRemake = true;
    this.search();
  },
  onPullDownRefresh() {
    this.iptSearch();
  },
  onBackPress(e) {
    // 左侧自定义导航
    uni.switchTab({
      url: "/page-admin/admin/index",
    });
    return true;
  },
  onShow() {
    // this.search()
    // this.$plugs.pageTop()
  },
  watch: {
    selectTree() {
      this.iptSearch();
    },
    deep: true,
  },
  computed: {
    userInfo() {
      return JSON.parse(uni.getStorageSync("userInfo"));
    },
  },
  methods: {
    iptSearch() {
      this.page = 1; 
      this.isRemake = false;
      this.monitorList = [];
      this.search();
    },
    init() {
      let { departmentIdList, departmentName } = this.userInfo;
      this.selectTree.value = departmentIdList[departmentIdList.length - 1];
      this.selectTree.label = departmentName;
      this.search();
    },

    handleHospitalShow() {
      let params = this.selectTree;
      // params.hospital = true;
      params.monitor = true;
      //  params.checkOnlyLeaf = true;
      this.$goTree(params);
      // this.childMethod=true;
      // this.$refs.childMethod.openShow()
    },
    selectRow(row) {
      //选择医院点击确定
      this.selectHos = row;
      this.isRemake = false;
      this.search();
      console.log(this.selectHos);
    },
    async search() {
      // 查询监控列表数据
      try {
        if (!this.selectTree.value) {
          uni.showToast({
            title: "请选择医院",
            icon: "none",
          });
          return;
        }

        let params = {
          departmentId: this.selectTree.value,
          devIdno: this.devIdno,
          pageNo: this.pageNo,
          pageSize: 10,
        };
        params.devIdno || delete params.devIdno;
        let { code, message, result } = await monitoringList(params);
        if (code == 200) {
          if (this.isRemake) {
            this.monitorList = this.monitorList.concat(result.records);
          } else {
            this.monitorList = result.records;
          }
        } else {
          uni.showToast({
            title: message,
            icon: "none",
          });
        }
        this.$plugs.pageTop();
        uni.stopPullDownRefresh();
      } catch (e) {
        console.log(e);
      }
    },
    async del(id) {
      this.isRemake = false;
      let params = {
        id,
      };
      let _this = this;
      uni.showModal({
        title: "提示",
        content: "您确定要删除监控设备吗？",
        success: function (res) {
          if (res.confirm) {
            // 点击删除
            deleteMonitor(params).then((resp) => {
              if (resp.code == 200) {
                uni.showToast({
                  title: "删除成功",
                  icon: "none",
                });
                setTimeout(() => {
                  _this.monitorList = [];
                  _this.search();
                }, 1000);
              } else {
                uni.showToast({ title: message, icon: "none" });
              }
            });
          }
        },
      });

      // let {code,result,message} = await deleteMonitor(params);
      // if(code == 200){
      //     uni.showToast({title:"删除设备成功",icon:"success"})
      //     this.$refs.uToast.show({
      //         title: "用户名不能为空",
      //     });
      //     setTimeout(()=>{
      //         this.monitorList=[];
      //         this.search();
      //     },1000)
      // }else{
      //     uni.showToast({title:message,icon:"none"})
      // }
    },
    goAdd() {
      //跳转 设备增加页面
      uni.navigateTo({
        url: "/page-admin/admin/monitor/redact" + "?type=" + 1,
      });
    },
    goDetail(item) {
      //跳转 设备编辑页面
      uni.navigateTo({
        url:
          "/page-admin/admin/monitor/redact" +
          "?params=" +
          JSON.stringify(item) +
          "&type=2",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.compile-btn {
  border: 2rpx solid $my-main-color;
  color: $my-main-color;
}
.del-btn {
  border: 2rpx solid red;
  color: red;
}
.btn {
  width: 160rpx;
  height: 56rpx;
  background: #ffffff;
  border-radius: 30rpx;
  font-size: 24rpx;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.label {
  font-size: 28rpx;
  color: rgba(0, 0, 0, 1);
}

.container {
  min-height: 100vh;
  background: RGBA(243, 245, 247, 1);
  .header {
    width: 100%;
    height: 180rpx;
    background: $my-main-color;
    .header-cont {
      .ipt-box {
        position: relative;
        input {
          height: 72rpx;
          width: 100%;
          height: 100%;
          border-radius: 36rpx;
          padding: 16rpx 16rpx 16rpx 84rpx;
          background: #fff;
        }
        img {
          position: absolute;
          left: 40rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 32rpx;
          height: 32rpx;
        }
      }
    }
    .checkDrop-box {
      height: 100rpx;
      .checkDrop {
        position: relative;
        input {
          width: 550rpx;
          height: 54rpx;
          line-height: 44rpx;
          background: RGBA(91, 116, 199, 1);
          padding-right: 64rpx;
          padding-left: 16rpx;
          border-radius: 30rpx;
          color: #ffffff;
          font-size: 24rpx;
          text-align: center;
        }
        img {
          position: absolute;
          right: 40rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 16rpx;
          height: 9rpx;
        }
      }
    }
  }

  .main {
    padding-bottom: 120rpx;
    .hspList {
      min-height: 384rpx;
      background: #ffffff;
      margin-top: 20rpx;
      .hspList-top {
        padding-top: 26rpx;
        min-height: 286rpx;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        view:nth-of-type(2n) {
          margin: 10rpx 0;
        }
      }
      .hspList-bottom {
        min-height: 96rpx;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
  .footer {
    width: 100vw;
    height: 100rpx;
    background: $my-main-color;
    position: fixed;
    bottom: 0;
    // 字体
    font-size: 32rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>