<template>
  <view class="">
    <u-popup mode="right" width="550" v-model="show">
      <view class="content">
        <scroll-view scroll-y="true" style="height:calc(100vh - 100rpx)">
          <ly-tree
            ref="tree"
            :isEdit="false"
            :treeData="treeData"
            node-key="id"
            show-radio
            expand-on-click-node
            :filter-node-method="filterNode"
            checkOnClickNode
            :highlight-current="true"
            :default-expanded-keys="expandKeys"
            :default-checked-keys="checkedKeys"
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
            <view @tap="quite" class="">
                取消
            </view>
            <view v-if="checkoutValue.checkedKeys.length==0"  class="opcity">
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
import {getMyDepartmentTreeList,sysDepartmentTreeList} from '@/utils/api' 

export default {
  data() {
    return {
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
    lyTree,
  },
  computed:{
    
  },
  props:{
      isRoleTree:{
        type:Boolean,
        default:false
      }, 
  },
  watch:{
  },
  onShow(){
  },
  methods: {
    init(){
      try{
        if(this.isRoleTree){
          this.treeData = this.$store.state.leftTreeData
          // this.treeData =JSON.parse(uni.getStorageSync("add:treeData"));
        }else{
           getMyDepartmentTreeList().then(({code,result})=>{
                if(code==200){
                  this.treeData = result
                }
            })
                // this.$store.dispatch('getLeftTreeData');
                // this.treeData = this.$store.state.leftTreeData;
                // this.treeData =JSON.parse(uni.getStorageSync("leftTreeData"));
          }
        }catch(e){
          console.log(e);
          //TODO handle the exception
      }
      
    },
      quite(){
          this.show = false;
          console.log(this.checkoutValue);
          this.checkoutValue={checkedKeys:[]}
      },
      submit(){
          this.$emit("checkoutValue",this.checkoutValue);
        //   this.parentId = this.checkoutValue;
          this.show = false;
          uni.setStorageSync("checkoutValue",JSON.stringify(this.checkoutValue));
      },
      openModel(params={}) {
        this.show = true;
        this.init()
        if(params.departmentId){
          setTimeout(()=> {
             this.expandKeys = [params.departmentId];
            this.checkedKeys= [params.id];
            console.log(this.checkedKeys= [params.id]);
        }, 500);
        }
        // this.expandKeys = [];
        // this.checkedKeys= [];
      if(this.checkoutValue.checkedKeys.length>0){   //判断用户之前已经选择好了的id，默认展开
        this.checkoutValue = JSON.parse(uni.getStorageSync("checkoutValue")) ;
          setTimeout(()=> {
            this.expandKeys.push(this.checkoutValue.data.parentId)
            // this.checkedKeys.push(this.checkoutValue.data.id);
            this.checkedKeys = this.checkoutValue.checkedKeys;
        }, 500);
      }
        
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.departName.indexOf(value) !== -1;
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
    // this.init()
   
    // setTimeout(()=>{
    //     this.expandKeys.push("42");
    // },1000)
  }
};
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
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