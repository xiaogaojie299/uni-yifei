<template>
	<ly-tree ref="tree" 
		:tree-data="data" 
		node-key="value"
        label="departName"
        children="childrenList" 
		highlight-current
		expand-current-node-parent
        @node-expand="handleNodeExpand" 
        @node-click="handleNodeClick"
	/>
</template>

<script>
	import LyTree from '@/compontens/tree/ly-tree/ly-tree.vue'
	export default {
		components: {
			LyTree
		},
		
		data() {
			return {
				data: [{
					nodeId: 1,
					label: '一级 1',
					children: [{
						nodeId: 4,
						label: '二级 1-1',
						children: [{
							nodeId: 9,
							label: '三级 1-1-1',
							children: [{
								nodeId: 11,
								label: '四级 1-1-1-1'
							},{
								nodeId: 12,
								label: '四级 1-1-1-2'
							}]
						}, {
							nodeId: 10,
							label: '三级 1-1-2'
						}]
					}]
				}, {
					nodeId: 2,
					label: '一级 2',
					children: [{
						nodeId: 5,
						label: '二级 2-1'
					}, {
						nodeId: 6,
						label: '二级 2-2'
					}]
				}, {
					nodeId: 3,
					label: '一级 3',
					children: [{
						nodeId: 7,
						label: '二级 3-1'
					}, {
						nodeId: 8,
						label: '二级 3-2'
					}]
				}]
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
            // uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
            handleNodeClick(obj) {
                console.log('handleNodeClick', JSON.stringify(obj));
            },
            handleNodeExpand(obj) {
                console.log('handleNodeExpand', JSON.stringify(obj));
            }
        }
	};
</script>