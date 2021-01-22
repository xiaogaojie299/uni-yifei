<template lang="">
    <!-- <div id="main" style="width: 1000rpx;height:600rpx;"></div> -->
    <div id="chart-column" class="chart-box" ref="refChart"></div>
    <!-- <div id="main" style="width: 1000rpx;height:600rpx;border:1px solid red;"></div> -->
    
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
        widgetType: {
                type: String,
                default: 'ColumnByTodayRank'
        },
    },
    watch:{
        'chartData':{
            handler(){
                // this.test()
                this.initChart()
            },
            deep:true
        }
    },
    created(){
    },
    mounted(){
        this.initChart();
    },
    beforeDestroy() {
            if (!this.chart) return;
            this.chart.dispose();
            this.chart = null;
        },
    methods:{
        test(){
        var myChart = this.$eCharts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '世界人口总量',
                subtext: '数据来自网络'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['2011年']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230]
                },
                
            ]
        };
        console.log(myChart);
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        initTodayCollectRankColumn() {  // 收集排行榜
        try{
            // var myChart = this.$eCharts.init(document.getElementById('main'));
            let chartData = this.chartData;
            let _yAxis = [];
                let _data = [];
                chartData.forEach(e => {
                    _yAxis.push(e['name']);
                    _data.push(e['data']);
                });
                let chartOption = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            let color = params.color; // 图例颜色
                            let htmlStr = '<div>';
                            htmlStr += params.name + '：' + params.data + ' KG';
                            return htmlStr;
                        },
                    },
                    grid: {
                        left: '2%',
                        right: '10%',
                        bottom: '8%',
                        containLabel: true
                    },
                    dataZoom:{
                        type: 'inside'
                    },
                    xAxis: {
                        type: 'value',
                        name: '(kg)',
                        splitLine: {
                            show: false
                        },
                    },
                    yAxis: {
                        type: 'category',
                        data: _yAxis,
                        axisTick: {
                            alignWithLabel: false
                        },
                        splitLine: {
                            show: false
                        },
                        boundaryGap: [0, 0.01],
                    },
                    color: COLORFUL,
                    series: [
                        {
                            type: 'bar',
                            data: _data
                        }
                    ],
                }; 
                this.chart.clear();
                this.chart.setOption(chartOption);
        }catch(e){
            //TODO handle the exception
            console.log(e);
        }
                
        },
        initTodayCollectTotalColumn() { // 近七日医废收集总量
            let chart = this.$eCharts.init(this.$refs.refChart,{
                width:1000,
                height:1000
            });
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
                            tip = ' ' + params[0].name + ' ' + Number(total).toFixed(2) + ' KG' + '<br/>';
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
                            margin:10
                        },
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '(kg)',
                            splitLine: {
                                show: false,
                            },
                            offset: -5.5
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
                // chart.setOption(chartOption);
                this.chart.setOption(chartOption);
        },
        initChart() { // 初始化
        try{
            // this.chart = this.$eCharts.init(document.getElementById('main'));
            // let chartData = this.chartData;
            this.chart = this.$eCharts.init(this.$refs.refChart);
            console.log("this.$refs.refChart==>",this.$refs.refChart);
            // window.onresize = this.chart.resize;
            if (this.widgetType == 'ColumnByTodayRank') {
                this.initTodayCollectRankColumn();
            } else if (this.widgetType == 'ColumnByTodayCollectTotal') {
                this.initTodayCollectTotalColumn();
            } else if (this.widgetType == 'ColumnType') {
                this.initColumnType();
            } else if (this.widgetType == 'ColumnStackArea') {
                this.initColumnArea();
            }
            }catch(e){
            //TODO handle the exception
        }
        },
    }
}
</script>
<style lang="scss" scoped>
    .chart-box{
        height: 700rpx;
    }
</style>