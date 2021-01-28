<template lang="">
    <view class="">
        <!-- <div id="main" style="width: 600px;height:400px;"></div> -->
        <view class="">
            <!-- <select-tree :isEdit="isEdit"></select-tree> -->
            <!-- <my-calendar> </my-calendar> -->
        </view>
        <view class="">
            <u-button @tap="goTest()">测试{{checkedNodes}}{{timeStar}}</u-button>
        </view>
        <view class="">
            <u-picker mode="time" @confirm="confirm" v-model="show" :default-time="defaulTime" :params="{year: true,month: true,}"></u-picker>
        </view>
        <!-- <view class="">
            <u-button @tap="goTree()">测试{{checkedNodes}}</u-button>
        </view> -->
    </view>
</template>
<script>
var echarts = require("echarts");
import mixins from "@/mixins/mx-calendar"
export default {
    provide:{
        "_this":this
    },
    mixins:[mixins],
    data(){
        return {
            show:true,
            isEdit:false,
            checkedNodes:{},
            defaulTime:"2020-2-10"
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
        goTest(){
            console.log('测试');
                this.handleOpen();
                this.show=true;
        },
        confirm(e){
            let {year,month,day} = e;
            this.defaulTime = `${year}-${month}`;
            console.log(this.defaulTime);
        },
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