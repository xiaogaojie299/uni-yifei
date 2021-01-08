import {listRegion} from "@/utils/api"
let mixins={
    data(){
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
            }],
            treeData:[]
        }
    },
    methods: {
        
    },
    created() {
        listRegion().then(({result})=>{
            // this.treeData = result;
            this.treeData = JSON.parse(uni.get)
        })
    },
}
export default mixins