<template lang="">
    <view class="container">
        <view class="content">
            <image v-if="roleInfo.logo" :src="roleInfo.logo" />
            <image v-else src="" />
            <view class="">
                <u-button @click="selectFile" :hair-line="false">修改</u-button>
            </view>
        </view>
        <u-toast ref="uToast" />
    </view>
</template>
<script>
// /file/upload
import baseURL from "@/utils/BASE_URL"
import {uploadRoleLOGO} from "@/utils/api"
export default {
    data(){
        return {
            roleInfo:{},  // 角色列表
            sourceType:['album', 'camera'],
            sizeType:['original', 'compressed'],
            tempFilePaths:[],        //生成的本地路径地址
            img:"",
            fileList:[],
            actions:baseURL + 'backend/file/upload'
        }
    },
    onLoad(option){
        this.roleInfo = JSON.parse(option.roleInfo);
        console.log(this.roleInfo);
    },
    methods:{
        // 选择图片
		selectFile() {
        // this.uploadImg()
            const {  sizeType,sourceType, lists,compressed } = this;
			// 设置为只选择图片的时候使用 chooseImage 来实现
			let chooseFile = new Promise((resolve, reject) => {
				uni.chooseImage({
					count: 1,
					sourceType: sourceType,
					sizeType,
					success: resolve,
					fail: reject
				});
			});
			chooseFile
				.then((res) => {
                    let that = this;
                    console.log(res);
                    that.tempFilePaths =res.tempFilePaths[0];   // 生成的本地路径
                    that.uploadImg().then(res=>{
                        if(res.code==200){
                            that.setLogo()
                        }
                    });
                })
				.catch(error => {
                    console.log(error);
				});
    },
    uploadImg(){    // 上传到阿里云服务器
        return new Promise((resolve,reject)=>{
            let fileUrl = baseURL + "backend/file/upload";
            console.log("this.tempFilePaths=",this.tempFilePaths);
            uni.uploadFile({
            url:fileUrl,     // 后端api接口
            filePath: this.tempFilePaths, // uni.chooseImage函数调用后获取的本地文件路劲
            header:this.getHeaders(),
             name: 'file',
            success:(res) => {
                res = JSON.parse(res.data);
                console.log(res);
                if (res.code == 200){
                    resolve(res)
                    this.roleInfo.logo = res.message;
                    console.log('文件上传成功',this.img)
                }
            }
            })
        })
        
    },
    setLogo(){
        let params = {
            	id: this.roleInfo.id,
	            logo: this.roleInfo.logo
        }
        uploadRoleLOGO(params).then(res=>{
            if(res.code==200){
                this.$refs.uToast.show({
					title: '修改成功',
					type: 'success'
                })
                setTimeout(()=>{
                    uni.navigateBack()
                },1500)
            }
        })
    },
     getHeaders() {
        let token = uni.getStorageSync("token");
        let headers = {};
        headers['X-Access-Token'] = token;
        headers["Accept"] = "application/json, text/plain, */*, */*";
        return headers;
    },
}
}
</script>
<style lang="scss" scoped>
    /deep/ .u-btn{
        width: 160rpx;
        height: 56rpx;
        background: #FFFFFF;
        border-radius: 30rpx;
        border: 2rpx solid #1539AF;
        font-size: 24rpx;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #1539AF;
    }
    .container{
        
    }
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        image{
            margin:72rpx 0;
            border: 50%; 
            width: 400rpx;
            height: 400rpx;
            border-radius: 50%;
            background: #EBF0FF;
        }
    }
</style>