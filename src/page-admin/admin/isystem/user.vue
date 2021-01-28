<template>
    <view class="container">
        <u-sticky>
			
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
                <view class="checkDrop-box flex-ver-center">
                     <view @tap="handleHospitalShow" class="checkDrop">
                        <view class="select-title-box nowrap-hidden">
                            <view class="">{{selectTree.label ||'选择组织'}}</view>
                        </view>
                            <img src="@/static/images/down_arrow.png" alt="">
                    </view>
                    
                    <view @tap="handleRoleShow" class="checkDrop">
                        <view class="select-title-box nowrap-hidden">
                            <view class="">{{selectRole[0].label || "选择角色"}}</view>
                        </view>
                            <img src="@/static/images/down_arrow.png" alt="">
                    </view>

                </view>
               
            </view>
        </view>
		</u-sticky>

        <!-- 中间主体列表 -->
        <view class="main">
            <view class="hspList" v-for="(item,index) in list" :key="index">
                <view class="hspList-top my-box">
                    <view class="">
                        <text class="label font-w-400">所属组织：</text>
                        <text class="label font-w-500">{{item.area || ""}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">医院：</text>
                        <text class="label font-w-500">{{item.hospital || ""}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">部门：</text>
                        <text class="label font-w-500">{{item.department || ""}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">科室：</text>
                        <text class="label font-w-500">{{item.office || ""}}</text>
                    </view>
                     <view class="">
                        <text class="label font-w-400">用户名称：</text>
                        <text class="label font-w-500">{{item.name || ""}}</text>
                    </view>
                     <view class="">
                        <text class="label font-w-400">手机号：</text>
                        <text class="label font-w-500">{{item.phone || ""}}</text>
                    </view>
                    <view class="">
                        <text class="label font-w-400">用户角色：</text>
                        <text class="label font-w-500">{{item.roleName || ""}}</text>
                    </view>

                    <!-- 状态 -->
                    <view class="status" :class="item.status==1?'open-color':'close-color'">
                        {{item.status==1?"启用":"禁用"}}
                    </view>
                    <!-- <view class="">
                        <text class="label font-w-400">自动关闭时间(分钟)：</text>
                        <text class="label font-w-500">{{item.autoCloseSecond}}</text>
                    </view> -->
                </view>
                <view class="hspList-bottom my-box">
                    <view class="flex">
                        <view @tap="go_edit(item)" class="btn ml-20 mr-20 compile-btn flex-ver-center">
                           编辑 
                        </view>
                        <view @tap="goDetail(item.id,item.status)" class="btn compile-btn flex-ver-center">
                           {{item.status==1?"禁用":"启用"}} 
                        </view>
                        
                        <view @tap="del(item.id)" class="btn ml-20 other-btn flex-ver-center">
                           删除
                        </view>
                    </view>
                </view>
            </view>
            
        </view> 
        
        <view @tap="goAdd" class="footer flex-ver-center">
            新增用户
        </view>

        <!-- 选择医院名称 -->
        <!-- <area-drop-down ref="childMethod" :list="firmList" @selectRow="selectRow"></area-drop-down> -->
        <!-- <u-select v-model="show" mode="single-column" label-name="name" value-name="id" :list="firmList" @confirm="selectRow"></u-select> -->
        <!-- :default-value="cascadeIndex" -->
        <!-- <h-select mode="mutil-column-auto" title="选择组织" v-model="show" :list="areaList" @confirm="cascadeCallback"></h-select> -->
        <!-- 角色弹框 -->
        <s-select mode="mutil-column-auto" title="角色" v-model="roleShow" label-name="roleName" value-name="id" :default-value="roleIndex" :list="roleList" @confirm="roleBack"></s-select>
    </view>    
</template>
<script>
import {monitoringList,deleteMonitor,deviceAgent,hardwareList,moveBatch,updateStatus,userList,sysRole,userDel,userBatch} from "@/utils/api"
import areaDropDown from "@/compontens/my-drop-down/area-drop-down"

import hSelect from '@/compontens/hospital-select';
import sSelect from '@/compontens/s-select';
export default {
    data(){
        return {
            firmList:[],        // 获取公司厂商
            show:false,         // 控制弹出层
            roleShow:false,
            name:"",            // input框搜索内容
            pageNo:1,
            isRemake:true,      // 判断返回的监控列表是追加还是重新赋值 true:不追加   false:追加
            list:[],             // 数据列表
            monitorList:[],
            areaList:{},    //医院列表
            roleList:{},        // 角色列表
            selectHos:[{
                label:"",
                value:""
            }],        //选择的医院
            selectRole:[{
                label:"",
                value:""
            }],
            devIdno:null,             // 监控设备编号
            moveID:null,
            cascadeIndex:"",
            roleIndex:[0],                 // 默认选择的角色值
            selectTree:{}               // 选择医院传过来的值
        }
    },
    watch:{
        selectTree(){
            this.cascadeCallback();
            
        },
        deep:true
    },
    components:{
        sSelect,
        hSelect
    },
    created(){
        this.sysRole();
        // this.init();
        console.log("onCreated加载成功");
    },
    onReachBottom : function(){ //上拉触底加载更多
        this.pageNo++;
        this.isRemake = false;
        this.getList();
    },
    onPullDownRefresh() {
    // this.init();
    this.cascadeCallback()
  },
    onShow(){
        console.log("onShow加载成功");
        this.cascadeCallback();
    },
    methods:{
        async init(){
            try{
                let params = {
                    pageNo:1,
                    pageSize:10
                }
                let {code,result,message} = await userList(params);
                if(code == 200){
                    if(this.isRemake){
                        this.list = result.records;
                    }else{
                        this.list =this.list.concat(result.records);
                    }
                    uni.stopPullDownRefresh();
                }
            }catch(e){
                console.log(e);
            }
        },
        go_edit(item){
            console.log(item);
            // uni.navigateTo({
            //     url:"/page-admin/admin/isystem/add-user"    
            // })
            uni.navigateTo({
                url:"/page-admin/admin/isystem/edit-user"+"?form="+JSON.stringify(item)
            })
        },
        sysRole(){  // 获取角色列表
            let params = {
                type:-1
            }
            sysRole(params).then(res=>{
                this.roleList = res.result
                uni.setStorageSync("roleList", res.result)
            })
            
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
            this.list = [];
            this.selectHos = this.selectTree;
            this.isRemake = true;
            this.pageNo=1;
            this.getList();
            // this.cascadeIndexCalc(obj) 
        },
        roleBack(obj){  // 选择角色传过来的值
            this.roleList.forEach((item,index)=>{
                console.log(item.id);
                if(item.id == obj[0].value){
                    console.log(item.id);
                    this.roleIndex = [index];
                }
            })
            this.selectRole = obj;
            this.list = [];
            this.isRemake = true;
            this.pageNo=1;
            this.getList();
        },
        
        handleHospitalShow(id){
            let params = this.selectTree;
            params.hospital = true;
            this.$goTree(params)
            // this.show = true;
        },
        handleRoleShow(){   // 弹出角色选择框
            this.roleShow = true;
        },
        async selectRow(row){ //选择医院点击确定
            this.isRemake = true        //重新赋值，不加班
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
            console.log("id==",id);
            let params = {
                id
            }
            uni.showModal({
                title: '提示',
                content: '是否要删除用户',
                success: function (res) {
                    if (res.confirm) {
                        userDel(params).then(res=>{
                            let {code,result,message} = res;
                            if(code == 200){
                            uni.showToast({title:"删除用户成功",icon:"success"})
                            setTimeout(()=>{
                                console.log(that);
                                that.getList();
                            },1000)
                        }else{
                            uni.showModal
                            uni.showToast({title:message,icon:"none"})
                        }
                        })
                        // let {code,result,message} = await userDel(params);
                        
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            })

            
        },
        goAdd(){ //跳转 设备增加页面
            uni.navigateTo({
                url:"/page-admin/admin/isystem/add-user"    
            })
        },
        async goDetail(id,status){ //跳转 设备编辑页面
            let that = this;
            that.isRemake = true;
            let params = {
                ids:id,
                status:status==1?2:1
            }
            let text = status==1?"禁用":"启用"
            uni.showModal({
                title: '提示',
                content: `确定${text}该用户`,
                success: function (res) {
                    if (res.confirm) {
                        userBatch(params).then(res=>{
                            let {code,result,message} = res;
                            if(code == 200){
                            uni.showToast({title:`${text}该用户成功`,icon:"success"})
                            setTimeout(()=>{
                                that.getList();
                            },1000)
                        }else{
                            uni.showModal
                            uni.showToast({title:message,icon:"none"})
                        }
                        })
                        // let {code,result,message} = await userDel(params);
                        
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
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
                // let params = {
                //     name:this.name,
                //     pageNo:this.pageNo,
                //     pageSize:10
                // }
                let params = {
                    pageNo:this.pageNo,
                    keyword:this.name,
                    pageSize:10
                }
                console.log(this.selectHos);
                // if(this.selectHos.length>0 && this.selectHos[0].value!==""){
                //     params.hospitalId =Number( this.selectHos[this.selectHos.length-1].value);
                // }
                if(JSON.stringify(this.selectHos)!=="{}"){
                    params.hospitalId =this.selectHos.value;
                }
                if(this.selectRole.length>0 && this.selectRole[0].value!==""){
                    params.roleName = this.selectRole[0].label;
                }
                this.name || delete params.keyword;
                console.log("params",params);
                let {code,result,message} = await userList(params);
                uni.stopPullDownRefresh();
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
                width:100%;
                display: flex;
                justify-content: space-between;
                .checkDrop{
                // width: 460rpx;
                    position: relative;
                width:320rpx;
                height: 44rpx;
                background: RGBA(91, 116, 199, 1);
                border-radius: 22rpx;
                color: #FFFFFF;
                .select-title-box{
                    width: 280rpx;
                    height: 44rpx;
                    display: flex;
                    align-items: center;
                    padding-left:12px;
                }
                img{
                    position: absolute;
                    right: 10px;
                    top:50%;
                    transform: translateY(-50%);
                    width: 16rpx;
                    height: 9rpx;
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
                .hspList-top{
                    padding-top:26rpx;
                    padding-bottom: 20rpx;
                    position: relative;
                    // min-height: 286rpx;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                    view:nth-of-type(2n){
                        margin:10rpx 0;
                    }
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