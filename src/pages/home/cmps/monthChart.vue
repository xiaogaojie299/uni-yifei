<template lang="">
    <div id="main" style="height:600rpx;"></div>
</template>
<script>
import {getTodayRankList,getLastSevenDaysStatistics} from "@/utils/api.js";
import * as utilDate from "@/utils/getData"
import {COLORFUL} from "@/config/theme.config"
export default {
    data(){
        return {
            isEdit:false,
            chart:null
        }
    },
    props:{
        chartData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        index:{
            type: Number/String,
            default: 0
        }
    },
    watch:{
        index(){
        },
        'chartData':{
            handler(val){
                if(this.index ==1){
            this.initTodayCollectTotalColumn()

                }
            },
            deep:true
        }
    },
    created(){
    },
    mounted(){
        this.initTodayCollectTotalColumn()
        
    },
    beforeDestroy() {
            if (!this.chart) return;
            this.chart.dispose();
            this.chart = null;
        },
    methods:{
        initTodayCollectTotalColumn() { // 近七日医废收集总量
             this.chart = this.$eCharts.init(document.getElementById("main"));
             console.log(this.chartData);
                let chartData = this.chartData;
                let chartOption = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter:function (params) {
                            let tip = '';
                            let total = 0;
                            total = params[0].value[1];
                            tip = ' ' + params[0].name + '<br/>';
                            tip = params[0].name + ' ' + Number(total).toFixed(2) + ' KG' + '<br/>';
                            tip = tip + params[0].marker + params[0].seriesName + '：' + params[0].value[1] + ' KG' + '<br/>';
                            tip = tip + params[1].marker + params[1].seriesName + '：' + params[1].value[2] + '<br/>';
                            return tip;
                        }
                    },
                    legend: {},
                    xAxis: {
                        type: 'category',
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: 40,
                        },
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '(kg)',
                            splitLine: {
                                show: false,
                            },
                        },
                        {
                            type: 'value',
                            name: '(袋)',
                            splitLine: {
                                show: false,
                            },
                        },
                    ],
                    // dataZoom:[
                    //     {
                    //         type:'slider',//slider表示有滑动块的，inside表示内置的
                    //         show:true,
                    //         xAxisIndex:[0],
                    //         start:10,
                    //         end:35
                    //     }
                    // ],
                    color: COLORFUL,
                    dataset: {
                        source: chartData
                    },
                    series: [
                        {
                            type: 'bar',
                            yAxisIndex: 0,
                        },
                        {
                            type: 'bar',
                            yAxisIndex: 1,
                        }
                    ]
                };
                this.chart.clear();
                this.chart.setOption(chartOption);
        },
    }
}
</script>
<style lang="scss" scoped>
    .chart-box{
        height: 700rpx;
        border: 1px solid red;
    }
</style>