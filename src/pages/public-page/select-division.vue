<template>
  <!-- 选择科室,部门,组织 -->
  <view class="">
    <u-sticky>
      <view class="header">
        <view class="header-cont my-box">
          <!-- 顶部input -->
          <view class="ipt-box">
            <!-- icon -->
            <img :src="require('@/static/images/search.png')" alt="" />
            <!-- input框 -->
            <input
              @confirm="search()"
              confirm-type="search"
              type="text"
              v-model="name"
              placeholder="请输入医院完整名称搜索"
            />
          </view>
        </view>
      </view>
    </u-sticky>
    <view class="content">
      <scroll-view scroll-y="true" style="height:calc(100vh - 300rpx)">
        <ly-tree
          ref="tree"
          :isEdit="false"
          :treeData="treeData"
          show-radio
          :node-key="treeDataOpt.nodeKey"
          :filter-node-method="treeDataOpt.filterNode"
          expand-on-click-node
          checkOnClickNode
          :highlight-current="true"
          :default-expanded-keys="expandKeys"
          :default-checked-keys="checkedKeys"
          @check="handleCheck"
          @radio-change="handleRadioChange"
          @node-click="handleNodeClick"
          :checkOnlyLeaf="pageParams.checkOnlyLeaf"
        ></ly-tree>

        <!-- <ly-tree :tree-data="treeData"
                        :isEdit="false" 
                        ref="tree" 
                        node-key="id" 
                        show-radio 
                        checkOnClickNode
                        @node-click="handleNodeClick" 
                    /> -->
      </scroll-view>
      <view class="btn-group">
        <view v-if="checkoutValue.checkedKeys.length == 0" class="opcity">
          确定
        </view>
        <view v-else @tap="submit">
          确定
        </view>
      </view>
    </view>
    <!-- <u-button @click="test">测试</u-button> -->
  </view>
</template>

<script>
/* 选择树状图 */
import {
  listRegionChildren,
  listRegion,
  sysDepartmentTreeList,
  getMyDepartmentTreeList,
} from "@/utils/api";
import LyTree from "@/compontens/tree/ly-tree/ly-tree.vue";
export default {
  components: {
    LyTree,
  },
  props: {
    /* 树状图数据 默认科室 */

    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    treeData() {
      let checkOnlyLeaf = this.pageParams.checkOnlyLeaf; // 判断树结构显示的数据 为true只能选择医院
      let hospital = this.pageParams.hospital; // 选择医院 也可选择科室
      if (hospital) {
        this.treeDataOpt.nodeKey = "value";
        // getMyDepartmentTreeList().then(({result})=>{
        //     console.log("result===>",result);
        //     return result
        // })
        return JSON.parse(localStorage.getItem("leftTreeData"));
      }
      if (checkOnlyLeaf) {
        this.treeDataOpt.nodeKey = "value";
        /* 
                        this.treeDataOpt.props = function(){
                            return {
                            label: 'label', // 指把数据中的‘personName’当做label也就是节点名称
                            children: 'children' // 指把数据中的‘childs’当做children当做子节点数据
                        }
                    }
                    */
        return JSON.parse(localStorage.getItem("hospital"));
      } else {
        getMyDepartmentTreeList().then(({ result }) => {
          this.treeDataOpt.nodeKey = "id";
          return result;
        });
        // return JSON.parse(localStorage.getItem("treeData"))
        // return this.$store.state.leftTreeData
      }
    },
  },
  data() {
    return {
      name: "", //输入框搜索的医院
      defaultData: [], // 默认显示树状图数据结构
      props: function() {
        return {
          // 这里的label就可以使用函数进行自定义的渲染了
          label(data, node) {
            return node.data.departName;
          },
          //label: 'departName', // 指把数据中的‘personName’当做label也就是节点名称
          children: "childrenList", // 指把数据中的‘childs’当做children当做子节点数据
        };
      },
      isshow: 2,
      checkoutValue: {
        checkedKeys: [],
      },
      expandKeys: [], //默认展开的节点
      checkedKeys: [], // 默认选中的节点
      pageParams: {}, // 上个页面传过来的参数 checkOnlyLeaf 属性默认只能选择最后一层
      treeDataOpt: {
        nodeKey: "", // 树节点唯一的节点
        filterNode(value, data) {
          // 查询
          if (!value) return true;
          return data.label.indexOf(value) !== -1;
        },
      },
    };
  },
  // 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
  onLoad(options) {
    this.pageParams = JSON.parse(options.params);
    this.$nextTick(() => {
      // expand-current-node-parent配置表示展开当前节点的父节点
      //this.$refs.tree.setCurrentKey(9);
    });
  },

  onShow() {
    this.init();
  },
  created() {
    this.$store.dispatch("getLeftTreeData");
    // sysDepartmentTreeList().then(({result})=>{
    //     uni.setStorageSync("treeData",JSON.stringify(result))
    // })
    // this.getTreeDalta()
  },
  methods: {
    init() {
      this.expandKeys = [];
      this.checkedKeys = [];
      if (JSON.stringify(this.pageParams) !== "{}") {
        //判断用户之前已经选择好了的id，默认展开
        setTimeout(() => {
          this.expandKeys.push(this.pageParams.parentId);
          this.checkedKeys = [this.pageParams.value];
          console.log(this.checkedKeys);
        }, 500);
      }
    },
    handleNodeClick() {
      console.log("你好");
    },
    handleNodeClick(obj) {},
    handleCheck(node) {
      this.checkoutValue = node;
    },
    handleRadioChange(obj) {},

    search() {
      console.log(this.$refs.tree.filter);
      this.$refs.tree.filter(this.name);
    },
    goAddDepart() {
      uni.navigateTo({
        url: "./add-depart",
      });
    },
    getTreeDalta(data) {
      getMyDepartmentTreeList().then(({ code, result }) => {
        console.log("result==>", result);
        this.defaultData = result;
      });
    },
    handleNodeExpand(obj) {
      // console.log('handleNodeExpand', JSON.stringify(obj));
    },
    submit() {
      //点击确定
      let checkedNodes = this.checkoutValue.node;
      console.log("checkedNodes", checkedNodes);
      // checkedNodes:this.checkoutValue.checkedNodes[0]
      // let pages = getCurrentPages();
      // var prevPage = pages[pages.length - 2];  //上一个页面
      // prevPage._data.checkedNodes = this.checkoutValue.checkedNodes[0];
      let params = {
        label: checkedNodes.label,
        value: checkedNodes.data.value,
        parentId: checkedNodes.parentId,
      };
      let pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage._data.selectTree = params; // 将选择是值传到上一个页面
      // this.$store.commit('setCheckedNodes',params);
      uni.navigateBack();
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 120rpx;
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
    width: 100%;
    .checkDrop {
      // width: 460rpx;
      position: relative;
      width: 100%;
      height: 44rpx;
      background: RGBA(91, 116, 199, 1);
      border-radius: 22rpx;
      color: #ffffff;
      .select-title-box {
        height: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        width: 16rpx;
        height: 9rpx;
        margin-left: 16px;
      }
    }
  }
}
.content {
  padding-bottom: 100rpx;
  text-align: center;
}
.opcity {
  // opacity: 0.3;
  background: #b9c4e7 !important;
  border: none !important;
}
.btn-group {
  position: fixed;
  bottom: 0;
  z-index: 100;
  display: flex;
  height: 100rpx;
  width: 100%;
  box-shadow: 1px 1px 8px #c7c7c7;
  view {
    width: 100%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 26rpx;
    background: $my-main-color;
    border: 1px solid $my-main-color;
    color: #fff;
  }
}
</style>
