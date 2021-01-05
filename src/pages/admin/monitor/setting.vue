<template>
    <view class="container">
        <view class="header">
            <view class="header-cont my-box">
                <!-- 顶部input -->
                <view class="ipt-box">
                    <!-- icon -->
                    <img src="@/static/images/search.png" alt="" />
                    <!-- input框 -->
                    <input type="text" v-model="devIdno" placeholder="输入监控设备编号" />
                </view>
                <!-- 选择组织 -->
                <view class="checkDrop-box flex-ver-center">
                     <view @tap="handleHospitalShow" class="checkDrop">
                        <input placeholder="选择组织" :value="selectHos.label" class="flex-center" type="text" disabled />
                        <img src="@/static/images/down_arrow.png" alt="">
                    </view>
                </view>
               
            </view>
        </view>

        <!-- 中间主体列表 -->
        <view class="main">
            <view class="hspList" v-for="(item,index) in monitorList" :key="index">
                <view class="hspList-top my-box">
                    <view class="">
                        <text class="label font-w-400">医院名称：</text>
                        <text class="label font-w-500">{{item.hospitalName}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">监控设备名称：</text>
                        <text class="label font-w-500">{{item.deviceName}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">监控设备编号：</text>
                        <text class="label font-w-500">{{item.devIdno}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">通道数1：</text>
                        <text class="label font-w-500">{{item.channelNum}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">自动关闭时间(分钟)：</text>
                        <text class="label font-w-500">{{item.autoCloseSecond}}</text>
                    </view>
                </view>
                <view class="hspList-bottom my-box">
                    <view class="flex">
                        <view @tap="goDetail" class="btn compile-btn flex-ver-center">
                           编辑 
                        </view>
                        <view class="btn del-btn ml-20 flex-ver-center">
                           删除 
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
            devIdno:null             // 监控设备编号
        }
    },
    components:{
        areaDropDown
    },
    created(){
        this.init()
    },
    onReachBottom : function(){ //上拉触底加载更多
        this.pageNo++;
        this.search();
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
                    devIdno:this.devIdno,
                    pageNo:this.pageNo,
                    pageSize:10
                }
                params.devIdno||delete params.devIdno;
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
        },
        goDetail(){ //跳转 设备增加 和设备编辑页面
            uni.navigateTo({
                url:"/pages/admin/monitor/redact"
            })
        }
    },
    
}
</script>
<style lang="scss" scoped>
.compile-btn{
    border:2rpx solid $my-main-color;
    color: $my-main-color;
}
.del-btn{
    border:2rpx solid red;
    color: red;
}
.btn{
    width: 160rpx;
    height: 56rpx;
    background: #FFFFFF;
    border-radius: 30rpx;
    font-size: 24rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
}
.label{
    font-size:28rpx;
    color: rgba(0, 0, 0, 1);
}

    .container{
        min-height: 100vh;
        background: RGBA(243, 245, 247, 1);
        .header{
            width: 100%;
            height: 180rpx;
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
                .checkDrop{
                width: 460rpx;
                position: relative;
                input{
                    width: 460rpx;
                    height: 44rpx;
                    background: RGBA(91, 116, 199, 1);
                    padding:16rpx 64rpx 16rpx 16rpx;
                    border-radius: 22rpx;
                }
                img{
                    position: absolute;
                    right: 40rpx;
                    top:50%;
                    transform: translateY(-50%);
                    width: 16rpx;
                    height: 9rpx;
                }
            }
            }
            
        }

        .main{
            .hspList{
                min-height: 384rpx;
                background: #FFFFFF;
                margin-top: 20rpx;
                .hspList-top{
                    padding-top:26rpx;
                    min-height: 286rpx;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                    view:nth-of-type(2n){
                        margin:10rpx 0;
                    }
                }
                .hspList-bottom{
                    min-height: 96rpx;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                }
            }
        }
    }
</style>