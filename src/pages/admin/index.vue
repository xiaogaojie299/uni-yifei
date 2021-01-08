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
          class="flex-ver-center menu-item"
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
          class="sub-menu"
        >
          <view :class="{active: index2 === subMenuActive, 'menu-item': true}" v-for="(item2, index2) in kindlist[change].children" :key="index2" @tap="goUrl(item2.path, index2)">
            {{ item2.meta.title }}
          </view>
        </scroll-view>
        <scroll-view
          :scroll-y="true"
          style="white-space: nowrap; min-height: 400rpx"
          :scroll-into-view="clickId"
          :scroll-with-animation="true"
          @scroll="scroll"
          @scrolltolower="scrolltolower"
          class="sub-menu"
          v-show="subMenuList.length > 0"
        >
          <view class="menu-item" v-for="(subMenu, subMenuIndex) in subMenuList" :key="subMenuIndex" @tap="jumpCustom(subMenu.route)">
            {{ subMenu.name }}
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
      subMenuActive: '', // 被选中的二级菜单索引
      subMenuList: [], // 自定义的菜单列表, 展示在第三列 {name: '菜单名称', route: '跳转路由,不需要带mw/admin,直接走goUrl方法'}
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
  // 自定义路由跳转
  jumpCustom(url) {
		uni.navigateTo({
			url: '/pages/admin' + url
		});
  },
	goUrl(url, index) {
		console.log("点击跳转",url);
    console.log("跳转","/pages/admin"+url);

    switch (url) {
      case '/mw/outbound/setting':
        url = '/mw/outbound-setting';
        break;
      // 预警配置要单独做处理
      case '/warning/setting':
        // 设置为选中
        this.subMenuActive = index;
        this.warningSetting();
        return ;
        break;
    }
		uni.navigateTo({
			url:"/pages/admin" + url
		})
  },
  warningSetting() {
    let menus = [
      '未出医废配置',
      '违规交接预警',
      '入库超时预警',
      '出库超时预警',
      '遗失预警',
      '入库重量预警',
      '出库重量预警',
      '泄露预警',
      '破损预警'
    ];
    for (let i in menus) {
      this.subMenuList.push({
        name: menus[i],
        route: '/warning/setting?type=' + (++i)
      });
    }
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
    .menu-item {
      width: 240rpx;
      height: 100rpx;
    }
  }
  .right {
    flex: 1;
    display: flex;
    width: 510rpx;
    .sub-menu {
      width: 240rpx;
      box-sizing: border-box;
      padding: 0 30rpx;
    }
    .sub-menu:last-child {
      width: 270rpx;
    }
    .menu-item {
      text-align: center;
      width: inherit;
      height: 80rpx;
      line-height: 80rpx;
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