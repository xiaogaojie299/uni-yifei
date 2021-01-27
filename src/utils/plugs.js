export const pageTop = (duration=0)=>{
    uni.pageScrollTo({
        scrollTop: 0,
        duration: duration
        });
}
export const goLogin =  ()=>{
    window.location.replace("http://192.168.0.36:8082/");
}