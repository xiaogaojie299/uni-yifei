export const pageTop = (duration=0)=>{
    uni.pageScrollTo({
        scrollTop: 0,
        duration: duration
        });
}
export const goLogin =  ()=>{
    // window.location.replace("http://47.108.162.242:8081/index.html#/");
    window.location.replace("http://192.168.0.51:8082/");
    // window.location.replace("http://47.108.162.242:8081/index.html#/")
} 