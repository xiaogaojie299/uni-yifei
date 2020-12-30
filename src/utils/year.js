let allYear=function(){
    //var oDate = new Date();oDate.setYear(oDate.getFullYear() + 1)；oDate.getTime();
    let now = new Date().getFullYear(); //现在时间
    let yearArr =[];
    for (var i=50;i>=0;i--){
        let yearObj ={};
        yearObj.value=now - i;
        yearObj.label=`${now - i}年`
        yearArr.unshift(yearObj)
    }
    return yearArr
}
export default allYear
