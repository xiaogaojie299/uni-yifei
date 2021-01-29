<template>
    <view class="container">
                <!-- 选择监控 -->
                <u-sticky>
                    <view class="header">
                        <view class="my-box">
                            <!-- 选择医院 -->
                                <view class="lable">
                                    <!-- <text>选择医院</text> -->
                                    <input @click="handleHospitalShow" placheolder="请选择医院" :value="selectTree.label" type="text" disabled>
                                </view>
                        </view>
                    </view>
                </u-sticky>
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
        <!-- <area-drop-down ref="childMethod" :list="areaList" @selectRow="selectRow"></area-drop-down> -->
        <!-- <mw-select></mw-select> -->
        <s-select mode="mutil-column-auto" title="选择组织" v-model="cascadeShow" :list="areaList" @confirm="cascadeCallback" :default-value="cascadeIndex"></s-select>
        <!-- <view style="height: 70rpx;line-height: 70rpx;width: 100%;text-align: center;" v-show="monitorList.length == 0">暂无数据</view> -->
        <no-data v-if="monitorList.length == 0"></no-data>
    </view>
</template>
<script>
// import mwSelect from '@/compontens/mw-select/mw-select';
import {monitoringList} from "@/utils/api"
import areaDropDown from "@/compontens/my-drop-down/area-drop-down"
import sSelect from '@/compontens/hospital-select';
export default {
    data(){
        return {
            monitorList:[],
            areaList:{},    //医院列表
            selectHos:{},        //选择的医院
            pageNo:1,
            cascadeShow:false,
            cascadeIndex:[],
            selectTree:{}
        }
    },
    created(){
        this.init()
    },
    onReachBottom : function(){ //上拉触底加载更多
        this.pageNo++;
        this.search();
    },
    onPullDownRefresh() {
    this.reload();
    this.search();
  },
    watch:{
        selectHos(){
        },
        selectTree(){
            // this.search();
            this.submit()
        },
        deep:true
    },
    computed:{
        userInfo(){
            return JSON.parse(uni.getStorageSync("userInfo"));
        }
    },
    methods:{
        init(){
            let {departmentIdList,departmentName} = this.userInfo;
            this.selectTree.value = departmentIdList[departmentIdList.length -1];
            this.selectTree.label = departmentName
            this.search()
        },
        reload(){
            this.pageNo =1;
            this.monitorList = [];
        },
        cascadeIndexCalc(e) {
            let cascadeIndex = [];
            let tmpData = this.areaList;
            for (let i in e) {
                let index = tmpData.findIndex(item => item.value == e[i].value);
                if (index > -1) {
                    cascadeIndex.push(index);
                    tmpData = tmpData[index].children;
                }
            }
            this.cascadeIndex = cascadeIndex;
        },
        cascadeCallback(obj){
            this.cascadeIndexCalc(obj) 
        },
        handleHospitalShow(){
            // this.cascadeShow =true;
            let params = this.selectTree;
            params.hospital = true;
            this.$goTree(params);
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
                if(!this.selectTree.value){
                    uni.showToast({
                        title:"请选择医院",
                        icon:"none"
                    })
                    return 
                }
                
                let params = {
                    departmentId:this.selectTree.value,
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
                uni.stopPullDownRefresh();
            }catch(e){
                console.log(e);
            }
        }
    },
    components:{
        areaDropDown,sSelect
    }
    
}
</script>
<style lang="scss" scoped>
page{
    background: RGBA(243, 245, 247, 1);
}
.mw-select-item {
        background: rgba(82, 75, 75, 0.3);
        border-radius: 30rpx;
        margin: 0 10rpx;
        min-width: 160rpx;
        height: 54rpx;
        padding: 2rpx 30rpx;
        color: #fff;
        display: flex;
        font-size: 24rpx;
        justify-content: center;
        align-items: center;
        flex: 1;
        .name {
            @include text-overflow;
        } 
        &.group {
            // min-width: 240rpx;
            // max-width: 80%;
        }
    }
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
        // background: RGBA(243, 245, 247, 1);
        width: 100%;
        // min-height:100vh;
        .header{
            width: 100%;
            height: 100rpx;
            background:$my-main-color;
            .my-box{
                height: 100rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .lable{
                margin:0 auto;
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
                     width: 550rpx;
                    height: 54rpx;
                    line-height: 44rpx;
                    background: RGBA(91, 116, 199, 1);
                    padding-right: 64rpx;
                    padding-left: 16rpx;
                    border-radius: 30rpx;
                    color: #FFFFFF;
                    font-size: 24rpx;
                    text-align:center;
                    // padding-left:44rpx;
                    // height: 100%;
                    // width: 400rpx;
                }
                
            }
        }
        .main{
            .hpt{
                min-height: 232rpx;
                background: #FFFFFF;
                margin-top: 20rpx;
                // .hpt-inline{
                //     height: 20rpx;
                //     background: RGBA(243, 245, 247, 1);
                // }
                .hpt-content-row{
                    position: relative;
                    min-height: 134rpx;
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