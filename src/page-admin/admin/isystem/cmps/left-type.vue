<template>
  <view class="">
    <u-popup mode="right" width="550" v-model="show">
      <view class="content">
        <scroll-view scroll-y="true" style="height:calc(100vh - 100rpx)">
            <orgType :orgType="orgTypeNum" />
        </scroll-view>
          <view class="btn-group">
            <view @tap="quite" class="">
                取消
            </view>
            <view v-if="!unitValue.value"  class="opcity">
                确定
            </view>
            <view v-else @tap="submit">
                确定
            </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import lyTree from "@/compontens/tree/ly-tree/ly-tree.vue";
import {getMyDepartmentTreeList} from '@/utils/api';
import orgType from "../org-type"
export default {
  data() {
    return {
      orgTypeNum:null,
      show: false,  //遮罩层开关
      treeData: [], //树结构数据
      checkoutValue:{checkedKeys:[]},   //选择的节点数据
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
      expandKeys:[],          //默认展开的数
      checkedKeys:[]          // 默认选中的节点
    };
  },

  components: {
    orgType
  },
  computed:{
    unitValue(){
      return this.$store.state.unitValue
    }
  },
  watch:{
  },
  onShow(){
    this.init()
  },
  methods: {
    init(){
      
    },
      quite(){
          this.show = false;
          console.log(this.checkoutValue);
          this.checkoutValue={checkedKeys:[]}
      },
      submit(){
          this.show = false;
      },
      openModelOrg(type) {
        console.log(type);
        this.orgTypeNum=type
        this.show = true;
      },
      handleNodeClick(obj) {
      },
      handleCheck(node) {
        this.checkoutValue = node
      },
      handleRadioChange(obj) {
      },
  },
  created() {
    // this.treeData = JSON.parse(uni.getStorageSync("treeData"));
    
   
    // setTimeout(()=>{
    //     this.expandKeys.push("42");
    // },1000)
  }
};
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
  padding-left:30rpx;
}
.opcity{
    opacity: 0.3;
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