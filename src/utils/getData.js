const getDate = (year, month, day) => {
  return new Date(year, month, day);
};
// 获取时间戳
const getTimer=(time)=>{
  return time.getFullYear()+'/'+time.getMonth()+'/'+time.getDate()
  // return new Date(time*60*60*24*1000);
}
//时间戳转为年 月 日
const getTimeType=(timer)=>{  //timer = 时间戳毫秒
  timer = new Date(timer);
  let month=timer.getMonth()+1<10?"0"+(timer.getMonth()+1):timer.getMonth()+1;
  let day=timer.getDate()<10?"0"+timer.getDate():timer.getDate();
    return timer.getFullYear()+"-"+month+"-"+day
}
const getYearMonthDay=(timer)=>{  //timer = 时间戳毫秒
  timer = new Date(timer);
  let year = timer.getFullYear();
  let month=timer.getMonth()+1<10?"0"+(timer.getMonth()+1):timer.getMonth()+1;
  let day=timer.getDate()<10?"0"+timer.getDate():timer.getDate();
    // return timer.getFullYear()+"-"+month+"-"+day
    return {year,month,day}
}
const dayTotal = (year = new Date().getFullYear(),month = new Date().getMonth()+1)=>{ // 获取当前月有多少天
  console.log(new Date(year, month, 0).getDate());
  return  new Date(year, month, 0).getDate()
}

// 今日查询 startTime: 2021-01-01 00:00:00  endTime: 2021-01-01 23:59:59
const getToday=(timer=new Date())=>{
  let startTime = getTimeType(timer) + " 00:00:00";
  let endTime = getTimeType(timer) + " 23:59:59";
  return {startTime,endTime}
}
// 按七天查询
const getSevenDay = (timer=new Date())=>{
  let timeTep = timer.getTime(); // 现在的时间戳
  let sevenTep = timeTep + 6*24*60*60*1000; // 7天后的时间戳
  let sevenDay = getTimeType(sevenTep);
  let startTime = getTimeType(timer) + " 00:00:00";
  let endTime = sevenDay + " 23:59:59";
  return {startTime,endTime}
}
// 月查询 startTime: 2021-01-01 00:00:00  endTime: 2021-01-01 23:59:59
const getMonth=(timer=new Date())=>{
  let {year,month} = getYearMonthDay(timer)
  let startTime = year+"-"+"01"+"-01" + " 00:00:00";
  let endTime = year+"-"+"01-" +dayTotal()+ " 23:59:59";
  return {startTime,endTime}
}
// 按季度查询 
const getQuarter=(timer=new Date())=>{
  let {year,month} = getYearMonthDay(timer);
  let quarterArr = [
    {
      startTime:`${year}-01-01 00:00:00`,
      endTime:`${year}-03-31 23:59:59`
    },
    {
      startTime:`${year}-04-01 00:00:00`,
      endTime:`${year}-06-30 23:59:59`
    },
    {
      startTime:`${year}-07-01 00:00:00`,
      endTime:`${year}-09-30 23:59:59`
    },
    {
      startTime:`${year}-10-01 00:00:00`,
      endTime:`${year}-12-31 23:59:59`
    },
  ]
    if(Number(month)>=1 &&Number(month)<4){
      return quarterArr[0]
    }else if (Number(month)>=4 &&Number(month)<7){
      return quarterArr[1]
    }else if(Number(month)>=7 &&Number(month)<10){
      return quarterArr[2]
    }else{
      return quarterArr[3]
    }
}

//  按半年查询
const getHalfYear = (timer=new Date())=>{
  let {year,month} = getYearMonthDay(timer);
  let HalfYearArr = [
    {
      startTime:`${year}-01-01 00:00:00`,
      endTime:`${year}-05-31 23:59:59`
    },
    {
      startTime:`${year}-06-01 00:00:00`,
      endTime:`${year}-12-31 23:59:59`
    }
  ]
  if(Number(month)<6){
    return HalfYearArr[0]
  }else{
    return HalfYearArr[1]
  }
}
const getYear = (timer=new Date())=>{ // 按照年查询
  let year = timer.getFullYear();
  let startTime = `${year}-01-01 00:00:00`
  let endTime = `${year}-12-31 00:00:00`
  return {startTime,endTime}
  
}
export { getYearMonthDay, getDate,getTimer,getTimeType,getToday,getMonth,getQuarter,getHalfYear,getYear,getSevenDay};
