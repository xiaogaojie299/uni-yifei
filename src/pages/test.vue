<template lang="">
    <view class="">
        <!-- <div id="main" style="width: 600px;height:400px;"></div> -->
        <view class="">
            <!-- <select-tree :isEdit="isEdit"></select-tree> -->
        </view>
        <view class="">
            <u-button @tap="goTree()">测试{{checkedNodes}}</u-button>
        </view>
    </view>
</template>
<script>
var echarts = require("echarts");
export default {
    data(){
        return {
            isEdit:false,
            checkedNodes:{}
        }
    },
    created(){
    },
    onLoad(options){
        console.log(options);
    },
    mounted(){
        console.log(echarts);
        this.init()
    },
    methods:{
        goTree(){
            this.$goTree()
        },
        init(){
        var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        var option = {
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    show:true
                },
                yAxis: {
                    type: 'value',
                    show:true
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                }]
            };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }   
    }
    
}
</script>