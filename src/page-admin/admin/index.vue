<template>
  <view class="admin-index">
      <scroll-view class="admin-index__menu">
        <view :class="{'flex-ver-center': true, 'admin-index__menu__item': true, 'admin-index__menu__item__active': index === change}"
            @key="index"
            v-for="(item, index) in kindlist"
            :key="index"
            @click="setid(index)"
          >
          {{item.meta ? (item.meta.title || '') : ''}}
        </view>
      </scroll-view>
      <scroll-view 
          class="admin-index__menu" 
          scroll-y
          scroll-with-animation
          :scroll-into-view="clickId"
          @scroll="scroll"
          >
          <view :class="{'admin-index__menu__item__active': index2 === subMenuActive, 'admin-index__menu__item': true}" v-for="(item2, index2) in kindlist[change].children" :key="index2" @tap="goUrl(item2.path, index2)">
            {{ item2.meta ? (item2.meta.title || '') : '' }}
          </view>
      </scroll-view>
      <scroll-view class="admin-index__menu" scroll-y scroll-with-animation>
          <view class="admin-index__menu__item" v-for="(subMenu, subMenuIndex) in subMenuList" :key="subMenuIndex" @tap="goUrl(subMenu.route, subMenuActive)">
            {{ subMenu.name }}
          </view>
      </scroll-view>

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
      sysMenus:[],        // 自定义的系统管理二级目录
      subMenuList: [], // 自定义的菜单列表, 展示在第三列 {name: '菜单名称', route: '跳转路由,不需要带mw/admin,直接走goUrl方法'}
    };
  },
  onReady() {
    this.getNodesInfo();
  },
  onShow() {
    this.init();
  },
  created(){
    this.getTreeData()
  },
  methods: {
    // init 初始化
    async init() {
      try {
        let { code, result, message } = await getMenu();
        	if (code == 200) {
          result.menu.splice(0,1);
          this.sysMenus=[
            {
              id: 14,
              meta: {title:"组织架构"},
              path: "/isystem/depart",
              route: "1"
            },
            {
              id: 14,
              meta: {title:"角色管理"},
              path: "/isystem/role",
              route: "1"
            },
            {
              id: 14,
              meta: {title:"用户管理"},
              path: "/isystem/user",
              route: "1"
            },
            {
              id: 14,
              meta: {title:"厂商管理"},
              path: "/isystem/device",
              route: "1"
            },
            {
              id: 14,
              meta: {title:"硬件管理"},
              path: "/isystem/deviceAgent",
              route: "1"
            },
            {
              id: 14,
              meta: {title:"登录记录"},
              path: "/isystem/login/record",
              route: "1"
            }
          ]
            result.menu[5].children=this.sysMenus;
            console.log(result.menu);
				  this.kindlist=result.menu;
        }
      } catch (e) {
        console.log(e);
      }
  },
	goUrl(url, index) {
    // this.subMenuActive = -1;
    // this.subMenuList = [];
    /* xgj 角色管理 三级目录 */
    if (url == '/isystem/role') {
        this.subMenuActive = index;
        this.roleMenu();
        return ;
    }
    /* -----------xgj 分割结束------------ */
    // 三级目录的特殊处理
    if (url == '/warning/setting') {
        this.subMenuActive = index;
        this.warningSetting();
        return ;
    }
    console.log("url",url);

    // 做了分包，路由有变动，routeMap和prefixMap的索引一一对应
    let routeMap = [
      'mw', 'warning', 'wraning'
    ];
    let prefixMap = [
      '/pages-mw', '/pages-mw', '/pages-mw'
    ];
    // 跳转前缀，之前是无脑跳这个前缀，现在做了分包，要重新处理
    let prefix = '/page-admin/admin';
    let urlArray = url.split('/');
    if (urlArray.length > 0) {
      // 如果有配置转发路由, 0是空，1才是第一个路由路径
      let routeIndex = routeMap.findIndex(i => i == urlArray[1]);
      if (routeIndex > -1) {
        prefix = prefixMap[routeIndex];
      }
    }

    // emmmmm 这个错别单词真是让我脑壳痛
    url = url.replace(/wraning/g, 'warning');
    console.log("jump=",prefix + url);
    uni.navigateTo({
      url: prefix + url
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
    this.subMenuList = [];
    for (let i in menus) {
      // 先校验有无权限
      let typeId = parseInt(i) + 1;
      if (!this.$util.checkPermission('warning:setting:type' + typeId)) {
        continue;
      }

      let route = '/warning/setting';
      if (typeId == 1 || typeId == 4) {
        route = '/warning/config';
      }
      this.subMenuList.push({
        name: menus[i],
        route: route + '?type=' + typeId
      });
    }
    // console.log("this.subMenuList==>",this.subMenuList);
  },
  roleMenu() {    // 角色管理的三级菜单
    let route = "/isystem/role"
    let menus = [
      {
        name:"运营角色管理",
        route:route+"/operation"
      },{
        name:"用户角色管理",
        route:route+"/user"
      },{
        name:"新增角色",
        route:route+"/add"
      }
    ];
    this.subMenuList =menus;
    console.log("this.subMenuList==>",this.subMenuList);
  },
    setid(i) {
      this.clickId = "po" + i;
      this.change = i;
      this.isLeftClick = true;
      this.subMenuActive = '';
      this.subMenuList = [];
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
    getTreeData(){
      this.$store.dispatch("getLeftTreeData")
    }
  },
};
</script>

<style lang="scss">
.admin-index {
  display: flex;
  flex-direction: row;
  font-size: 28rpx;
  &__menu {
    @include text-overflow;
    height: 100vh;
    width: 240rpx;
    background: #fff;
    &__item {
        text-align: center;
        width: inherit;
        height: 80rpx;
        line-height: 80rpx;
        &__active {
          font-weight: 500;
          color: #000;
        }
    }
    &:first-child {
      background: #f9f9f9 !important;
      .admin-index__menu__item__active {
        font-weight: 500;
        background-color: #fff !important;
        color: $my-main-color !important;
      }
    }
  }
}



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