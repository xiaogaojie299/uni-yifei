<template>
<view class="">
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
        <view class="main">
                <ly-tree v-if="isshow==2" ref="tree"
                    :treeData="data"
                    :props = props
                    node-key="id"
                    @delDep="delDep"
                    :isInjectParentInNode="true"
                    :expand-on-click-node="false"
                    highlight-current
                    expand-current-node-parent
                    @node-expand="handleNodeExpand" 
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNode"
                >
                </ly-tree>
                <ly-tree v-else ref="tree"
                    :treeData="data"
                    :isInjectParentInNode="true"
                    node-key="id"
                    :expand-on-click-node="false"
                    children="children" 
                    highlight-current
                    @node-expand="handleNodeExpand" 
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNode"
                >
                    <!-- expand-current-node-parent -->
                </ly-tree>
        </view>
        <view class="footer">
            <view @tap="goAddDepart" class="footer-btn flex-ver-center">
                新增架构
        </view>
        </view>
    <!-- <u-button @click="test">测试</u-button> -->
</view>
</template>

<script>
    import {listRegionChildren ,listRegion,sysDepartmentTreeList} from '@/utils/api' 
    import LyTree from '@/compontens/tree/ly-tree/ly-tree.vue'
	export default {
		components: {
			LyTree
        },
		data() {
			return {
                name:"", //输入框搜索的医院
                data:[],
                data1:[],
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
                isshow:2                
            };
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		onLoad() {
			this.$nextTick(() => {
				// expand-current-node-parent配置表示展开当前节点的父节点
				//this.$refs.tree.setCurrentKey(9);
			});
        },
        onBackPress(e){
            console.log("返回");
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 3]; //上一个页面
            uni.switchTab({
                url:"../index"
            })
                return true
            },
        onShow(){
             this.$store.commit('setUnitValue',{})
        },
        created(){
            this.init()
                
        },
        methods:{
            init(){
                // this.data = JSON.parse(uni.getStorageSync("hospital"));
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
                
                // sysDepartmentTreeList().then(({result})=>{
                //     console.log("result==>",result);
                //     uni.setStorageSync("treeData",JSON.stringify(result))
                //     // this.data = result;
                // })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.departName.indexOf(value) !== -1;
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
            delDep(){
                console.log("depart 删除成功");
                this.init()
            },
            // uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
            async handleNodeClick(obj) {
                if(this.isshow ==2){
                     //获取接口数据写法（此方法调用两个接口）
                     console.log(obj.data.orgType);
                    if (!obj.expanded) return; // 如果是关闭就返回
                            if(obj.data.orgType==4){return}
                            if (obj.data.childrenList && obj.data.childrenList.length > 0) return; // 如果已经有数据就返回
                            let params = {
                                parentId:obj.key 
                            }
                            let {result} = await listRegionChildren(params)
                            this.$nextTick(() => {
                                // this.$refs.tree.append(result[0],obj.value)
                                this.$refs.tree.updateKeyChildren(obj.key,result);
                            })
                    
                }
                
                    /* 
                console.log(obj);
                if(obj.childNodesId.length==0){
					let params = {
						parentId:obj.key
                    }
                    let {result} = await listRegionChildren(params)
                    this.$nextTick(() => {
                        // this.$refs.tree.append(result[0],obj.value)
                        console.log(obj.key);
                        this.$refs.tree.updateKeyChildren(obj.key,result);
                    })
                    console.log("加载成功",result);
                }
                */

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
            // height: 180rpx;
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
    .main{
        padding-bottom: 100rpx;
    }
</style>