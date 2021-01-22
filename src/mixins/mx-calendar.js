let mixins={
    data(){
        return {
            timerShow : true,
            timeStar:""
        }
    },
    methods: {
        handleOpen(){
            // console.log("你好打印成功",_this);
            this.timerShow=false
        },
        change(e){  //选择时间统计
            // console.log("选择起始时间-结束时间",e);
            // timeText = e.startDate + "" + e.endDate;
            this.timeStar=`${e.startDate} 00:00:00`;
            // timeEnd=`${e.endDate} 23:59:59`;
            console.log(this.timeStar);
        },
    },
    created() {
    },
}
export default mixins