const getYearMonthDay = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return { year, month, day };
};
const getDate = (year, month, day) => {
  return new Date(year, month, day);
};
// 获取时间戳
const getTimer=(time)=>{
  return time.getFullYear()+'/'+time.getMonth()+'/'+time.getDate()
  // return new Date(time*60*60*24*1000);
}
//时间戳转为年 月 日
const getTimeType=(timer)=>{
  timer = new Date(timer);
  let month=timer.getMonth()+1<10?"0"+(timer.getMonth()+1):timer.getMonth()+1;
  let day=timer.getDate()<10?"0"+timer.getDate():timer.getDate();
    return timer.getFullYear()+"-"+month+"-"+day
}
export { getYearMonthDay, getDate,getTimer,getTimeType };
