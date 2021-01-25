<template>
<view class="">
        <u-sticky>
    <view class="header">
			<view class="header-cont my-box">
                <!-- 顶部input -->
                <view class="ipt-box">
                    <!-- icon -->
                    <img :src="require('@/static/images/search.png')" alt="" />
                    <!-- input框 -->
                    <input @confirm="search()" confirm-type="search" type="text" v-model="name" placeholder="请输入医院完整名称搜索" />
                </view>
            </view>
        </view>
		</u-sticky>
       <view class="content">
        <scroll-view scroll-y="true" style="height:calc(100vh - 200rpx)">
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
    <!-- <u-button @click="test">测试</u-button> -->
</view>
</template>

<script>
    /* 选择树状图 */
    import {listRegionChildren ,listRegion,sysDepartmentTreeList,getMyDepartmentTreeList} from '@/utils/api' 
    import LyTree from '@/compontens/tree/ly-tree/ly-tree.vue'
	export default {
		components: {
			LyTree
        },
        props:{
            /* 树状图数据 默认科室 */
            treeData:{
                type:Array,
                default:()=>{
                    console.log(this);
                   return JSON.parse(("treeData"))
                }
            },
            isEdit:{
                type:Boolean,
                default:true
            },
            expandKeys:[],          //默认展开的数
            checkedKeys:[]          // 默认选中的节点
        },
		data() {
			return {
                name:"", //输入框搜索的医院
                defaultData:[],     // 默认显示树状图数据结构
                props: function() {
                    return {
                        // 这里的label就可以使用函数进行自定义的渲染了
                        label(data, node) {
                            return node.data.departName;
                        },
                        //label: 'departName', // 指把数据中的‘personName’当做label也就是节点名称
                        children: 'childrenList' // 指把数据中的‘childs’当做children当做子节点数据
                    }
                },
                isshow:2,
                checkoutValue:{
                    checkedKeys:[]
                }                
            };
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		onLoad() {
			this.$nextTick(() => {
				// expand-current-node-parent配置表示展开当前节点的父节点
				//this.$refs.tree.setCurrentKey(9);
			});
        },
        onShow(){
            console.log("执行成功");
             this.$store.commit('setUnitValue',{})
        },
        created(){
            /* 
                // 第一种树状图两个接口 
                if(this.isshow==2){
                     listRegion().then(res=>{
                        // this.data = res.result;
                        this.data = JSON.stringify(res.result)
                        this.data = res.result
                        console.log(this.data,"测试数据");
                        this.data1 = [{
                            canDelete: false,
                            childrenList:[{
                                    canDelete: false,
                                    childrenList:[{
                                        canDelete: false,
                                        departName: "泸州市",
                                        id: 41,
                                        isWarehouse: 0,
                                        key: 41,
                                        level: null,
                                        orgType: 1,
                                        parentId: 40,
                                        treeCode: "0000170013"
                                    }],
                                    departName: "四川省",
                                    id: 40,
                                    isWarehouse: 0,
                                    key: 40,
                                    level: null,
                                    orgType: 1,
                                    parentId: -1,
                                    treeCode: "000017"
                                }
                            ],
                            departName: "平台",
                            id: -1,
                            isWarehouse: 0,
                            key: -1,
                            level: null,
                            orgType: 1,
                            parentId: -999,
                            treeCode: "00"
                        }]
                        uni.setStorageSync("listRegion",JSON.stringify(res.result))
                    })
                }else{
                    // 获取树状图接口 
                    sysDepartmentTreeList().then(({result})=>{
                        console.log("result==>",result);
                        uni.setStorageSync("treeData",JSON.stringify(result))
                        this.data = result;
                    })
                }
             */
                sysDepartmentTreeList().then(({result})=>{
                    uni.setStorageSync("treeData",JSON.stringify(result))
                })

                this.getTreeDalta()
                  
        },
        methods:{
            handleNodeClick(){
                console.log("你好");
            },
            handleNodeClick(obj) {
            },
            handleCheck(node) {
            this.checkoutValue = node
            },
            handleRadioChange(obj) {
            },
            filterNode(value, data) {   // 查询
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            search(){
                console.log(this.$refs.tree.filter);
                this.$refs.tree.filter(this.name)
            },
            goAddDepart(){
                uni.navigateTo({
                    url:"./add-depart"
                })
            },
            getTreeDalta(data){
                getMyDepartmentTreeList().then(({code,result})=>{
                    console.log("result==>",result);
                    this.defaultData = result;
                })
            },
            handleNodeExpand(obj) {
                // console.log('handleNodeExpand', JSON.stringify(obj));
            }
        }
	};
</script>
<style lang="scss" scoped>
    .header{
            width: 100%;
            height: 120rpx;
            background: $my-main-color;
            .header-cont{
                .ipt-box{
                    position: relative;
                    input{
                        height: 72rpx;
                        width: 100%;
                        height: 100%;
                        border-radius: 36rpx;
                        padding:16rpx 16rpx 16rpx 84rpx;
                        background:#fff;
                    }
                    img{
                        position: absolute;
                        left:40rpx;
                        top:50%;
                        transform: translateY(-50%);
                        width: 32rpx;
                        height: 32rpx;
                    }
                }
            }
            .checkDrop-box{
                height: 100rpx;
                width:100%;
                .checkDrop{
                // width: 460rpx;
                position: relative;
                width:100%;
                height: 44rpx;
                background: RGBA(91, 116, 199, 1);
                border-radius: 22rpx;
                color: #FFFFFF;
                .select-title-box{
                    height: 44rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                img{
                    width: 16rpx;
                    height: 9rpx;
                    margin-left:16px
                }
            }
            }
            
        }
        .content {
            padding-bottom: 100rpx;
            text-align: center;
        }
        .opcity{
            opacity: 0.3;
        }
        .btn-group{
            position: fixed;
            bottom: 0;
            z-index: 100;
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