<template>
    <view class="box">
        <!-- <web-view :src="videoUrl"></web-view> -->
        <!-- <video :src="videoUrl"></video> -->
        <!-- <video src="http://47.108.58.51/808gps/open/player/video.html?lang=zh&devIdno=34020000001117993002&jsession=c61f2b803af24295aaf8a5ef45396ab4&channel=1&close=0"></video> -->
    <!-- <iframe :src="videoUrl"></iframe> -->
        <iframe class="frame" :src="videoUrl"></iframe>
    </view>
</template>
<script>
import {getJSession} from "@/utils/api"
export default {
    data(){
        return {
            videoUrl:"",
            MonitorData:{},
            text:"<video src='http://47.108.58.51/808gps/open/player/video.html?lang=zh&devIdno=34020000001117993002&jsession=c61f2b803af24295aaf8a5ef45396ab4&channel=1&close=0'></video>"
        }
    },
    onLoad(option){
        this.MonitorData = JSON.parse(option.params);
        this.getVideoUrl();
        console.log("this.MonitorData=>",this.MonitorData);
        let {hospitalName,deviceName} = this.MonitorData;
        uni.setNavigationBarTitle({
            title: `${hospitalName}-${deviceName}`
        });
    },
    components:{
    },
    methods:{
        async getVideoUrl(){
            let {devIdno,channelNum,autoCloseSecond} = this.MonitorData;
            try{
                let {code , message} = await getJSession();
                if(code==200){
                    this.videoUrl =`http://47.108.58.51/808gps/open/player/video.html?lang=zh&devIdno=${devIdno}&jsession=${message}&channel=${channelNum}&close=${autoCloseSecond * 60}`
                    console.log(this.videoUrl);
                }
            }catch(e){
                //TODO handle the exception
                console.log(e);
            }
        }
    }

}
</script>
<style lang="scss">
   .box{
       width: 100vw;
       .frame{
           height: 56.25vmin;
           width: 100%;
       }
   }
    
</style>