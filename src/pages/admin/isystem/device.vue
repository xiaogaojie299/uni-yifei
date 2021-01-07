<template>
    <view class="container">
        <view class="header">
            <view class="header-cont my-box">
                <!-- 顶部input -->
                <view class="ipt-box">
                    <!-- icon -->
                    <img src="@/static/images/search.png" alt="" />
                    <!-- input框 -->
                    <input @confirm="search()" confirm-type="search" type="text" v-model="name" placeholder="请输入关键字搜索特征码" />
                </view>
                <!-- 选择组织 -->
                <!-- <view class="checkDrop-box flex-ver-center">
                     <view @tap="handleHospitalShow" class="checkDrop">
                        <view class="select-title-box flex">
                            <view class="">{{selectHos.label}}</view>
                            <img src="@/static/images/down_arrow.png" alt="">
                        </view>
                    </view>
                </view> -->
               
            </view>
        </view>

        <!-- 中间主体列表 -->
        <view class="main">
            <view class="hspList" v-for="(item,index) in list" :key="index">
                <view class="hspList-top my-box">
                    <view class="flex">
                        <view class="label flex-center font-w-400">厂商名称：</view>
                        <view class="label font-w-500">{{item.name}}</view>
                    </view>
                    <view class="flex">
                        <view class="label left-label font-w-400">支持信息：</view>
                        <view class="label font-w-500 m-0"><text>{{item.description}} </text></view>
                    </view>
                    
                    <!-- <view class="">
                        <text class="label font-w-400">自动关闭时间(分钟)：</text>
                        <text class="label font-w-500">{{item.autoCloseSecond}}</text>
                    </view> -->
                </view>
                <view class="hspList-bottom my-box">
                    <view class="flex">
                        <view @tap="goDetail(item)" class="btn compile-btn flex-ver-center">
                           编辑
                        </view>
                        <view v-if="item.canDelete" @tap="del(item.id)" class="btn ml-20 del-btn flex-ver-center">
                           删除 
                        </view>
                        <view v-else class="btn ml-20 other-btn flex-ver-center">
                           删除 
                        </view>
                    </view>
                </view>
            </view>
            
        </view>
        
        <view @tap="goAdd" class="footer flex-ver-center">
            新增厂商
        </view>

        <!-- 选择医院名称 -->
        <!-- <area-drop-down ref="childMethod" :list="firmList" @selectRow="selectRow"></area-drop-down> -->
        <u-select v-model="show" mode="single-column" label-name="name" value-name="id" :list="firmList" @confirm="selectRow"></u-select>
    </view>    
</template>
<script>
import {deleteMonitor,deviceAgent,hardwareList,moveBatch,delBatch,deleteVendor} from "@/utils/api"
import areaDropDown from "@/compontens/my-drop-down/area-drop-down"
export default {
    data(){
        return {
            firmList:[],        // 获取公司厂商
            show:false,         // 控制弹出层
            name:"",            // input框搜索内容
            pageNo:1,
            isRemake:true,      // 判断返回的监控列表是追加还是重新赋值 true:不追加   false:追加
            list:[],             // 数据列表
            monitorList:[],
            areaList:{},    //医院列表
            selectHos:{},        //选择的医院
            devIdno:null,             // 监控设备编号
            moveID:null
        }
    },
    components:{
        areaDropDown
    },
    created(){
    },
    onReachBottom : function(){ //上拉触底加载更多
        this.pageNo++;
        this.isRemake = false;
        this.getList();
    },
    onShow(){
        // this.deviceAgent();
        this.getList()
    },
    watch:{
    },
    methods:{
        handleHospitalShow(id){
            this.moveID = id;
            this.childMethod=true;
            this.show = true;
        },
        async selectRow(row){ //选择医院点击确定
            this.isRemake = true        //重新赋值，不追加
            this.selectHos=row[0];
            let params = {
                deviceAgentId:this.selectHos.value,
                id:this.moveID
            }
            let {code,result,message} = await moveBatch(params);
            if(code==200){
                uni.showToast({
                    title:"操作成功",
                    icon:"none"
                })
                setTimeout(()=>{    //重新获取 list
                    this.pageNo=1;
                    this.getList()
                })
            }else{
                uni.showToast({
                    title:message,
                    icon:"none"
                })
            }
        },
         async search(){   // 查询监控列表数据
        },
        async del(id){
            let that = this;
            that.isRemake = true;
            let params = {
                id
            }
            uni.showModal({
                title: '提示',
                content: '确认删除该厂商？',
                success: function (res) {
                    if (res.confirm) {
                        deleteVendor(params).then(res=>{
                            let {code,result,message} = res;
                            if(code == 200){
                            that.pageNo=1;
                            uni.showToast({title:"删除厂商成功",icon:"success"})
                            setTimeout(()=>{
                                console.log(that);
                                that.getList();
                            },1000)
                        }else{
                            uni.showModal
                            uni.showToast({title:message,icon:"none"})
                        }
                        })
                        // let {code,result,message} = await delBatch(params);
                        
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            })

            
        },
        goAdd(item){ //跳转 设备增加页面
            // uni.navigateTo({
            //     url:"/pages/admin/isystem/add-vendor"+"?type="+1    
            // })
            uni.navigateTo({
                url:"/pages/admin/isystem/add-vendor"+"?type="+1    
            })
        },
        goDetail(item){ //跳转 设备编辑页面
            uni.navigateTo({
                url:"/pages/admin/isystem/add-vendor"+"?params="+JSON.stringify(item)    
            })
        },
        async deviceAgent(){
            // 获取厂商列表
            let params = {
                pageNo:1,
                pageSize:1000
            }
            try{
            let {code,result,message} =await deviceAgent(params);
            if(code==200){  
                this.firmList = result.records;
                uni.setStorageSync("firmList",JSON.stringify(result.records))
            }
            }catch(e){
                console.log(e);
            }
        },
        async getList(){
            try{
                let params = {
                    name:this.name,
                    pageNo:this.pageNo,
                    pageSize:10
                }
                this.name || delete params.name
                let {code,result,message} = await deviceAgent(params);
                if(code == 200){
                    if(this.isRemake){
                        this.list = result.records;
                    }else{
                        this.list =this.list.concat(result.records);
                    }
                }
            }catch(e){
                console.log(e);
            }
        }
    },
    
}
</script>
<style lang="scss" scoped>
.m-0{
    margin:0;
}
.open-color{
    color:rgba(255, 180, 43, 1)
}
.close-color{
    color: rgba(255, 63, 43, 1);
}
.compile-btn{
    border:2rpx solid $my-main-color;
    color: $my-main-color;
}

.del-btn{
    border:2rpx solid red;
    color: red;
}
.other-btn{
    border:1px solid RGBA(204, 204, 204, 1);
    color: RGBA(204, 204, 204, 1);
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
.left-label{
}

    .container{
        min-height: 100vh;
        background: RGBA(243, 245, 247, 1);
        .header{
            width: 100%;
            // height: 180rpx;
            height: 120rpx;
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
                width:100%;
                .checkDrop{
                // width: 460rpx;
                position: relative;
                width:100%;
                height: 44rpx;
                background: RGBA(91, 116, 199, 1);
                border-radius: 22rpx;
                color: #FFFFFF;
                .select-title-box{
                    height: 44rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                img{
                    width: 16rpx;
                    height: 9rpx;
                    margin-left:16px
                }
            }
            }
            
        }

        .main{
            padding-bottom: 120rpx;
            .hspList{
                // min-height: 384rpx;
                background: #FFFFFF;
                margin-bottom: 20rpx;
                  .hspList-top .flex:nth-child(2n){
                    margin:10rpx 0;
                }
                .hspList-top{

                    padding-top:26rpx;
                    // padding-bottom: 20rpx;
                    position: relative;
                    // min-height: 286rpx;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                
                    .status{
                        position: absolute;
                        right: 0;
                        top:13rpx;
                        font-size: 28rpx;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
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
        .footer{
            width: 100vw;
            height: 100rpx;
            background: $my-main-color;
            position: fixed;
            bottom: 0;
            // 字体            
            font-size: 32rpx;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
</style>