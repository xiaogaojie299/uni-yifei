<template>
    <view>
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
    .frame{
            width: 100vw !important;
            height: 60vh !important;
    }
    .video-box{
        overflow: hidden;
        border: 1px solid red;
        .frame{
            width: 100vw !important;
            height: 60vh !important;
        }
        // .frame{
        //         border:4px solid red;
        //         width: calc(60vw - 52px);
        //         height: calc(34vw - 29px);
        //         border: 0;
        //         overflow: hidden;
        //         &.finish{
        //             width: calc(60vw - 50px);
        //             height: calc(34vw - 29px + 56px);
        //         }
        //     }
        //     .play-video {
        //         height: 100%;
        //     }
    }
    
</style>