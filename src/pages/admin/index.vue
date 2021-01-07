<template>
  <view class="content">
    <view class="ld">
      <!-- :class="{active:index===change}" -->
      <view class="left">
        <view
          v-for="(item, index) in kindlist"
          :key="index"
          @click="setid(index)"
          :class="index === change ? 'active' : ''"
          class="flex-ver-center"
        >
          {{ item.meta.title }}
        </view>
      </view>
      <view class="right">
        <scroll-view
          :scroll-y="true"
          style="white-space: nowrap; min-height: 400rpx"
          :scroll-into-view="clickId"
          :scroll-with-animation="true"
          @scroll="scroll"
          @scrolltolower="scrolltolower"
        >
          <view v-for="(item2, index2) in kindlist[change].children" :key="index2" @tap="goUrl(item2.path)">
            {{ item2.meta.title }}
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import { getMenu } from "@/utils/api";
export default {
  data() {
    return {
      kindlist: [
        {
          title: "医废管理",
          list: [
            "医废追溯",
            "收集轨迹",
            "收集记录",
            "入库记录",
            "出库记录",
            "出库配置",
            "医废补录",
            "数据恢复",
          ],
        },
   
      ],
      clickId: "",
      change: 0,
      topList: [],
      isLeftClick: false,
    };
  },
  onReady() {
    this.getNodesInfo();
  },
  onShow() {
    this.init();
  },
  methods: {
    // init 初始化
    async init() {
      try {
        let { code, result, message } = await getMenu();
        	if (code == 200) {
				console.log("result",result);
				result.menu.splice(0,1);
				this.kindlist=result.menu;
        }
      } catch (e) {
        console.log(e);
      }
	},
	goUrl(url){
		console.log("点击跳转",url);
    console.log("跳转","/pages/admin"+url);
    if(url=="/mw/outbound/setting"){
      url="/mw/outbound-setting"
    }
		uni.navigateTo({
			url:"/pages/admin"+url
		})

	},
    setid(i) {
      this.clickId = "po" + i;
      this.change = i;
      this.isLeftClick = true;
    },
    scroll(e) {
      if (this.isLeftClick) {
        this.isLeftClick = false;
        return;
      }
      let scrollTop = e.target.scrollTop;
      // 只能变前第三个，最后一个到不了底部，只能用滚动到底部事件
      for (let i = 0; i < this.topList.length; i++) {
        let h1 = this.topList[i];
        let h2 = this.topList[i + 1];
        if (scrollTop > h1 && scrollTop < h2) {
          this.change = i;
        }
      }
    },
    // 滚动到底部
    scrolltolower() {
      setTimeout(() => {
        this.change = 3;
      }, 80);
    },
    getNodesInfo() {
      //小程序没有doucument和window对象(undefined)
      const query = uni.createSelectorQuery().in(this);
      query
        .selectAll(".title")
        .boundingClientRect()
        .exec((res) => {
          let nodes = res[0];
          let arr = [];
          nodes.map((item) => {
            arr.push(item.top);
          });
          this.topList = arr;
        });
    },
  },
};
</script>

<style lang="scss">
.ld {
  display: flex;
  font-size: 32rpx;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #000000;
  .left {
    width: 240rpx;
    min-height: 100vh;
    text-align: center;
    background: #f9f9f9;
    view {
      width: 240rpx;
      height: 100rpx;
    }
  }
  .right {
    flex: 1;
    padding-left: 72rpx;
    view {
      width: 240rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
    }
  }
}
.title {
  font-size: 20px;
  font-weight: bold;
  background-color: pink;
}
.active {
  background-color: #ffffff;
  color: $my-main-color;
}
</style>