let allYear=function(){
    //var oDate = new Date();oDate.setYear(oDate.getFullYear() + 1)；oDate.getTime();
    let now = new Date().getFullYear(); //现在时间
    let yearArr =[];
    let year = 2050;
    for (var i=100;i>=0;i--){
        let yearObj ={};
        yearObj.value=100 - i;
        yearObj.label=`${year - i}`;
        if(yearObj.label == now){
            yearObj.defaultIndex =100 - i;
        }
        yearArr.push(yearObj)
    }
    return yearArr
}
export default allYear
