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
        <view>
                <ly-tree ref="tree" 
                    node-key="value"
                    label="departName"
                    children="childrenList" 
                    highlight-current
                    expand-current-node-parent
                    @node-expand="handleNodeExpand" 
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNode"
                    :expandCurrentNodeParent="true"
                >
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        
                        <span>{{node}} ,{{data}}</span>
                        
                    </span>
                </ly-tree>
        </view>
	
    <!-- <u-button @click="test">测试</u-button> -->
</view>
</template>

<script>
    import {listRegionChildren} from '@/utils/api' 
    import LyTree from '@/compontens/tree/ly-tree/ly-tree.vue'
    import mixins from '@/mixins/mx-tree'
	export default {
        mixins:[mixins],
		components: {
			LyTree
        },
		data() {
			return {
                name:"" //输入框搜索的医院
			};
		},
		
		// 如果不需要不用到这些方法，需要删除相应代码，打印大量日志会造成性能损耗
		onLoad() {
			this.$nextTick(() => {
				// expand-current-node-parent配置表示展开当前节点的父节点
				this.$refs.tree.setCurrentKey(9);
			});
        },
        created(){
            this.data = JSON.parse(uni.getStorageSync("hospital"));
            console.log(this.data);
        },
        methods:{
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            search(){
                console.log(this.$refs.tree.filter);
                this.$refs.tree.filter(this.name)
            },
            // uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
            async handleNodeClick(obj) {
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
</style>