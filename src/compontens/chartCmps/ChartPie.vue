<template>
    <div id="chart-pie" class="chart-box" ref="refChart"></div>
</template>

<script>
    import {COLORFUL} from "../../config/theme.config"

    export default {
        name: "ChartPie",
        props: {
            chartData: {
                type: Object / Array,
            },
            widgetType: {
                type: String,
                default: 'crossTable'
            },
        },
        data() {
            return {
                chart: null,
            }
        },
        methods: {
            // 近七日医废收集总量
            initLast7DayCollectTotalPie() { 
                let chartData = this.chartData;
                let _data = [];
                let titleText = 0; // 计算总的收集总量
                if (chartData.dataList) {
                    chartData.dataList.forEach(e => {
                        titleText += e['data'];
                        _data.push({
                            name: e['name'],
                            value: e['data']
                        });
                    });
                }
                let chartOption = {
                    tooltip: {
                        trigger: 'item',
                        // formatter: '{a} <br/> {b}: {c} ({d}%)',
                        formatter: function (params) {
                            let seriesName = params.seriesName;
                            let percent = params.percent;
                            let name = params.name;
                            let value = params.value;
                            let htmlStr = '<div>';
                            htmlStr += seriesName + '<br>';
                            htmlStr += name + '：' + value + ' KG' + '（' + percent + '%）';
                            htmlStr += '</div>';
                            return htmlStr;
                        },
                    },
                    legend: {
                        icon: 'circle', // 图例形状
                        type: 'scroll',
                        orient: 'vertical',
                        x: 'left',
                        y: 'center',
                        itemWidth: 10,
                        itemHeight: 10,
                        formatter: function (name) {
                            let target;
                            let percentage = 0;
                            let percentageTotal = 0;
                            for (let i = 0; i < _data.length; i++) {
                                percentageTotal += _data[i].value;
                                if (_data[i].name == name) {
                                    target = _data[i].value;
                                }
                                if (percentageTotal == 0) {
                                    percentage = 0 + '%';
                                } else {
                                    percentage = (Number(Math.round(parseFloat(target) / parseFloat(percentageTotal) * 10000) / 100.00).toFixed(2)) + '%'
                                }
                            }
                            let arr = ["{b|" + name + "}", "{a|" + target + ' KG' + "}", "{c|" + percentage + "}"];
                            return arr.join('');
                        },
                        textStyle: {
                            rich: {
                                a: {
                                    fontSize: 16,
                                },
                                b: {
                                    fontSize: 16,
                                    padding: [0, 15, 0, 0],
                                },
                                c: {
                                    fontSize: 16,
                                    padding: [0, 0, 0, 15],
                                },
                            },
                            fontWeight: 'bold',
                        },
                    },
                    color: COLORFUL,
                    series: [{
                        name: '医废占比分析',
                        type: 'pie',
                        center: ['70%', '50%'],
                        radius: ['50%', '80%'],
                        data: _data,
                        labelLine: {
                            show: false,
                            length: 2
                        },
                        label: {
                            show: false,
                            position: 'outside',
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, .5)'
                            }
                        },
                    }],
                };
                this.chart.clear();
                this.chart.setOption(chartOption);
            },
            // 统计分析-医废类型分析-医废占比分析
            initTypePie() {
                let chartData = this.chartData;
                if (!chartData.legend || !chartData.dataList) {
                    document.getElementById('chart-pie').innerHTML = '<div style="font-size: 16px; color:#868686; padding-top: 199px; text-align: center;">暂无数据</div>';
                    document.getElementById('chart-pie').removeAttribute('_echarts_instance_');
                } else {
                    let _data = [];
                    let titleText = 0; // 计算总的收集总量
                    if (chartData.dataList) {
                        chartData.dataList.forEach(e => {
                            titleText += e['data'];
                            _data.push({
                                name: e['name'],
                                value: e['data']
                            });
                        });
                    }
                    let chartOption = {
                        tooltip: {
                            trigger: 'item',
                            // formatter: '{a} <br/> {b}: {c} ({d}%)',
                            formatter: function (params) {
                                let seriesName = params.seriesName;
                                let percent = params.percent;
                                let name = params.name;
                                let value = params.value;
                                let htmlStr = '<div>';
                                htmlStr += seriesName + '<br>';
                                htmlStr += name + '：' + value + ' KG' + '（' + percent + '%）';
                                htmlStr += '</div>';
                                return htmlStr;
                            }
                        },
                        legend: {
                            icon: 'circle', // 图例形状
                            type: 'scroll',
                            orient: 'vertical',
                            x: 'left',
                            y: 'center',
                            itemWidth: 10,
                            itemHeight: 10,
                            formatter: function (name) {
                                let target;
                                let percentage = 0;
                                let percentageTotal = 0;
                                for (let i = 0; i < _data.length; i++) {
                                    percentageTotal += _data[i].value;
                                    if (_data[i].name == name) {
                                        target = _data[i].value;
                                    }
                                    if (percentageTotal == 0) {
                                        percentage = 0 + '%';
                                    } else {
                                        percentage = (Number(Math.round(parseFloat(target) / parseFloat(percentageTotal) * 10000) / 100.00).toFixed(2)) + '%'
                                    }
                                }
                                let arr = ["{b|" + name + "}", "{a|" + target + ' KG' + "}", "{c|" + percentage + "}"];
                                return arr.join('');
                            },
                            textStyle: {
                                rich: {
                                    a: {
                                        fontSize: 16,
                                    },
                                    b: {
                                        fontSize: 16,
                                        padding: [0, 15, 0, 0],
                                    },
                                    c: {
                                        fontSize: 16,
                                        padding: [0, 0, 0, 15],
                                    },
                                },
                                fontWeight: 'bold',
                            },
                        },
                        color: COLORFUL,
                        series: [{
                            name: '医废占比分析',
                            type: 'pie',
                            center: ['70%', '50%'],
                            radius: ['50%', '80%'],
                            data: _data,
                            labelLine: {
                                show: false,
                                length: 2
                            },
                            label: {
                                show: false,
                                position: 'outside',
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, .5)'
                                }
                            },
                        }],
                    };
                    this.chart.clear();
                    this.chart.setOption(chartOption);
                }
            },
            // 初始化
            initChart() {
                this.chart = this.$Echarts.init(this.$refs.refChart);
                window.onresize = this.chart.resize;

                if (this.widgetType == 'PieByTodayCollectTotal') {
                    this.initLast7DayCollectTotalPie();
                } else if (this.widgetType == 'PieByType') {
                    this.initTypePie();
                }
            },
        },
        watch: {
            chartData: {
                handler(val) {
                    this.initChart();
                },
                deep: true,
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart();
            });
        },
        beforeDestroy() {
            if (!this.chart) return;
            this.chart.dispose();
            this.chart = null;
        },
    }
</script>
