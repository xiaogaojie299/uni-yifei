<template>
  <view class="">
    <u-popup mode="right" width="550" v-model="show">
      <view class="content">
        <scroll-view scroll-y="true" style="height: 100vh">
          <ly-tree
            ref="tree"
            :isEdit="false"
            :treeData="treeData"
            node-key="id"
            show-radio
            expand-on-click-node="false"
            :filter-node-method="filterNode"
            checkOnClickNode
            @check="handleCheck"
            @radio-change="handleRadioChange"
            @node-click="handleNodeClick"
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
          <!-- <u-button @click="show = false;">{{checkValue.label}}</u-button> -->
          <view class="btn-group">
            <view class="">
                取消
            </view>
            <view class="">
                确定
            </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import lyTree from "@/compontens/tree/ly-tree/ly-tree.vue";
export default {
  data() {
    return {
      show: false,  //遮罩层开关
      treeData: [], //树结构数据
      checkoutValue:null,   //选择的节点数据
      props: function () {
        return {
          // 这里的label就可以使用函数进行自定义的渲染了
          label(data, node) {
            return node.data.departName;
          },
          //label: 'departName', // 指把数据中的‘personName’当做label也就是节点名称
          children: "childrenList", // 指把数据中的‘childs’当做children当做子节点数据
        };
      },
    };
  },

  components: {
    lyTree,
  },
  methods: {
      openModel() {
      this.show = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.departName.indexOf(value) !== -1;
    },
    handleNodeClick(obj) {
    },
    handleCheck(node) {
      console.log("handleCheck", node);
      this.checkoutValue = node
    },
    handleRadioChange(obj) {
    //   console.log("handleRadioChange", obj);
    },
  },
  created() {
    this.treeData = JSON.parse(uni.getStorageSync("treeData"));
    console.log("adata==", this.treeData);
  }
};
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
}
.btn-group{
            position: fixed;
            bottom: 0;
            display: flex;
            height: 100rpx;
            width: 100%;
            box-shadow: 1px 1px 8px #c7c7c7;
            view{
                width: 50%;
                height: 100rpx;
                text-align: center;
                line-height: 100rpx;
                font-size:26rpx;
                color: black;
            }
                view:nth-of-type(1){
                    border: 1px solid #FAFAFA;
                    background:  #f5f5f5;
                    color:#333
                }
                view:nth-of-type(2){
                    background: $my-main-color;
                    border: 1px solid $my-main-color;
                    color: #fff;
                }

            }
</style>