<template lang="">
    <view class="container">
        <view class="content my-box">
            <view class="col-1">
                <view class="label">
                    厂商
                </view>
                <input v-model="params.name" type="text" placeholder="请输入厂商名称" value="" />
            </view>
            <!-- 支持信息 -->
            <view class="col-2">
                <view class="">
                    支持信息 
                </view>
                <!-- 留言板 -->
                <textarea v-model="params.description" placeholder="请输入支持信息" :auto-height="true" />
            </view>
        </view>
        <!-- 选择按钮 -->
        <view v-if="isSubmit" class="footer-btn flex-ver-center">
            完 成
        </view>
        <view v-else @tap="submit" class="footer-btn flex-ver-center allow">
            完 成
        </view>
        <u-toast ref="uToast" />
    </view>
</template>
<script>
import {addVendor,editVendor} from "@/utils/api"
export default {
    data(){
        return {
            data : {},
            params:{
                name:"",
                description:"",
            },
            type:1,   //1：新增  2：编辑
            isSubmit:true
        }
    },
    watch:{
        "params":{
            handler(newValue,oldValue){
                for (var key in newValue){
                  this.isSubmit = newValue[key]===""
                }
            },
            deep: true
        }
    },
    onLoad(option){
        option.type || (option.type = 2) 
        this.type =option.type;
        if(this.type ==2 ){
            this.data =JSON.parse(option.params);
            this.params.name = this.data.name;
            this.params.description = this.data.description
        }
        uni.setNavigationBarTitle({
                title: this.type ==1?"新增厂商":"编辑厂商信息"
        });
    },
    created(){
    },
    methods:{
          submit(){
            this.type==1?this.add():this.edit()
        },
        async add(){
            let params = {
                name:this.params.name,
                description:this.params.description
            }
            let {result,code,message} = await addVendor(params)
            if (code == 200) {
                this.$refs.uToast.show({
                    title: "添加厂商成功",
                    type: "success",
                });
                setTimeout(() => {
                    uni.navigateTo({
                        url:"/pages/admin/isystem/device"
                    })
                }, 1000);
            } else {
                uni.showToast({
                    title: message,
                    icon: "none",
                });
            }
        },
        async edit(){
            let params = {
                name:this.params.name,
                description:this.params.description
            }
            this.data.name = this.params.name;
            this.data.description = this.params.description;
            let {result,code,message} = await editVendor(this.data)
            if (code == 200) {
                this.$refs.uToast.show({
                    title: "编辑厂商成功",
                    type: "success",
                });
                setTimeout(() => {
                    uni.navigateTo({
                        url:"/pages/admin/isystem/device"
                    })
                }, 1000);
            } else {
                uni.showToast({
                    title: message,
                    icon: "none",
                });
            }
        }
    }
}
</script>
<style lang="scss" scope>
.allow{
    // background: $my-main-color;
    background: $my-main-color !important;
}
    .content{
        .col-1{
            height: 100rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            view:nth-of-type(1){
                width: 70rpx;
            }
            input{
                height:100%;
                width: 400rpx;
                text-align: right;
            }
        }
        .col-2{
            padding:28rpx 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            textarea{
                padding-top:12rpx;
                min-height: 60rpx;
            }
        }
    }
           .footer-btn {
    bottom: 0;
    position: fixed;
    width: 100vw;
    height: 100rpx;
    background: #b2b2b2;
    font-size: 32rpx;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #ffffff;
  }
</style>