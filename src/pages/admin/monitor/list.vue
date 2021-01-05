<template>
    <view class="container">
        <!-- 选择监控 -->
        <view class="header">
            <view class="my-box">
                <!-- 选择医院 -->
                <view class="lable">
                    <text>选择医院</text>
                    <input @click="handleHospitalShow" placeholder="请选择医院" :value="selectHos.label" type="text" disabled>
                </view>
                <view class="">
                    <view @click="submit" class="btn flex-ver-center">
                        查 询
                    </view> 
                </view>
            </view>
        </view>
        <view class="main">
            <view class="hpt" v-for="(item,index) in monitorList" :key="index">
                <!-- 横线 -->
                <!-- <view class="hpt-inline"></view> -->
                <!-- 主题内容 -->
                <view class="hpt-content my-box">
                    <view class="hpt-content-row">
                        <view class="mb-10">
                            <text class="label font-w-400">医院名称：</text>
                            <text class="label font-w-500">{{item.hospitalName}}</text>
                        </view>
                        <view class="">
                            <text class="label font-w-400">监控名称：</text>
                            <text class="label font-w-500">{{item.deviceName}}</text>
                        </view>
                    </view>
                    <!-- 底部按钮 -->
                    <view class="hpt-item-btn">
                        <view class="btn" @tap="goMonitorVideo(item)">
                            查看监控
                        </view>
                    </view>
                </view>   
            </view>
        </view>
        <!-- 选择医院名称 -->
        <area-drop-down ref="childMethod" :list="areaList" @selectRow="selectRow"></area-drop-down>
    </view>
</template>
<script>
import {monitoringList} from "@/utils/api"
import areaDropDown from "@/compontens/my-drop-down/area-drop-down"
export default {
    data(){
        return {
            monitorList:[],
            areaList:{},    //医院列表
            selectHos:{},        //选择的医院
            pageNo:1,
        }
    },
    created(){
        this.init()
    },
    onReachBottom : function(){ //上拉触底加载更多
        this.pageNo++;
        this.search();
    },
    watch:{
        selectHos(){
        },
        deep:true
    },
    methods:{
        init(){
            this.areaList = JSON.parse(uni.getStorageSync("hospital"));
            this.selectHos = this.areaList[0];
            this.search()
        },
        handleHospitalShow(){
            this.childMethod=true;
            this.$refs.childMethod.openShow()
        },
        selectRow(row){ //选择医院点击确定
            this.selectHos=row;
            console.log(this.selectHos);
        },
        submit(){   // 点击搜索按钮初始化
            this.pageNo=1;
            this.monitorList=[];
            this.search()
        },
        goMonitorVideo(item){   //跳转到监控详情
        let params = JSON.stringify(item)
            uni.navigateTo({
                url:"./check-monitor"+"?params="+params
            })
        },
        async search(){   // 查询监控列表数据
            try{
                if(!this.selectHos.value){
                    uni.showToast({
                        title:"请选择医院",
                        icon:"none"
                    })
                    return 
                }
                
                let params = {
                    departmentId:this.selectHos.value,
                    pageNo:this.pageNo,
                    pageSize:10
                }
                let {code,message,result} = await monitoringList(params);
                if(code==200){
                        this.monitorList = this.monitorList.concat(result.records);
                }else{
                    uni.showToast({
                        title:message,
                        icon:"none"
                    })
                }
            }catch(e){
                console.log(e);
            }
        }
    },
    components:{
        areaDropDown
    }
    
}
</script>
<style lang="scss" scoped>
.btn{
    width: 160rpx;
    height: 56rpx;
    background: #FFFFFF;
    border-radius: 30rpx;
    border: 2rpx solid #1539AF;
    font-size: 24rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #1539AF;
    display: flex;
    align-items: center;
    justify-content: center;
}
.label{
    font-size:28rpx;
    color: rgba(0, 0, 0, 1);
}
    .container{
        // position: fixed;
        top: 0;
        left: 0;
        background: RGBA(243, 245, 247, 1);
        width: 100%;
        min-height: 100vh;
        .header{
            width: 100%;
            height: 100rpx;
            background:#fff;
            .my-box{
                height: 100rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .lable{
                display: flex;
                height: 100%;
                align-items: center;
                & text{
                    font-size: 32rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #000000;
                }
                & input{
                    padding-left:44rpx;
                    height: 100%;
                    width: 400rpx;
                }
                
            }
        }
        .main{
            .hpt{
                height: 232rpx;
                background: #FFFFFF;
                margin-top: 20rpx;
                // .hpt-inline{
                //     height: 20rpx;
                //     background: RGBA(243, 245, 247, 1);
                // }
                .hpt-content-row{
                    position: relative;
                    height: 134rpx;
                    padding-top:22rpx;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                     & >view:nth-of-type(2){
                    }
                }
                .hpt-item-btn{
                    height: 96rpx;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
            }
        }
        
    }
</style>