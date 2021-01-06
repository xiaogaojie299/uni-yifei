import ajax from "./ajax";
import request from "./ajax";
import qs from "./qs";
let base = "/base/web/user/";
// 用户登录 
export function login(data){
  let url ="/system/user/login";
  return request.post(url,data);
}
// 发送验证码
export function getValidateCode(data){
  let url="/system/user/getValidateCode";
  return request.get(url,data);
}
// 检查手机号验证码是否正确
export function checkValidateCode(data){
  let url="/system/user/checkValidateCode"
  return request.post(url,data)
} 
// 重置密码
export function resetPassword(data){
  let url = "/system/user/resetPassword";
  return request.post(url,data)
}
// 多选菜单
export function getMenu(){
  let url = "/system/sysPermission/getUserPermissionByToken";
  return request.get(url)
}

/*  首页模块  */

// 获取首页出库记录，未出库记录 
export function getIndex(){
  let url = "/index/getIndex";
  return request.get(url);
}
// 获取未处理预警

/* ------------- */

/* 统计报表模块 */

// 获取医院级联
export function getMyHospitalCascadeList(){
  let url = "/system/sysDepartment/getMyHospitalCascadeList";
  return request.get(url)
}
// 获取取区域级联
export function getThreeAreaCascadeList(){
  let url = "/system/sysDepartment/getThreeAreaCascadeList"
  return request.get(url)
}
// 获取省。市，区，城市级联
export function getSysDepartment(){
  let url="/system/sysDepartment/getTwoAreaCascadeList"
  return request.get(url)
}
// 根据医院查询运输方式
export function listSelect(data){
 let url = "/medical/mwTransitConfig/listSelect";
 return request.get(url,data)
}
// 查询医疗废物转移联单
export function getTransformList(data){
  let url="/report/getTransformList";
  return request.get(url,data)
}
// 科室产废统计
export function getOfficeReportList(data){
  let url="/report/getOfficeReportList";
  return request.get(url,data)
}
// 医院产废记录
export function getHospitalReportList(data){
  let url="/report/getHospitalReportList";
  return request.get(url,data)
}
// 区域产废记录
export function getRegionReportList(data){
  let url="/report/getRegionReportList";
  return request.get(url,data)
}
// backend/statistics/getRangeStatistics
// 医院产废排行榜（累计）
export function getRangeStatistics(data){
  let url="/statistics/getRangeStatistics";
  return request.get(url,data)
}
// 医院产废排行榜（今日）
export function getTodayRankStatistics(data){
  let url ="/statistics/getTodayRankStatistics";
  return request.get(url,data)
}
// 医院产废排行榜（昨日）
export function getYesterdayRangeStatistics(data){
  let url ="/statistics/getYesterdayRangeStatistics";
  return request.get(url,data)
}
// 区域产废排行榜（累计）
export function getRegionRangeStatistics(data){
  let url="/statistics/getRegionRangeStatistics";
  return request.get(url,data)
}
// 区域产废排行榜（今日）
export function getRegionTodayRankStatistics(data){
  let url="/statistics/getRegionTodayRankStatistics";
  return request.get(url,data)
}
// 区域产废排行榜（昨日）
export function getRegionYesterdayRangeStatistics(data){
  let url="/statistics/getRegionYesterdayRangeStatistics";
  return request.get(url,data)
}

// 医废类型分析
export function getWasteTypeStatistics(data){
  let url = "/statistics/getWasteTypeStatistics"
  return request.get(url,data)
}
// 区域产废分析
export function getRegionStatistics(data){
  let url = "/statistics/getRegionStatistics"
  return request.get(url,data)
}
// 各环节重量分析
export function getSegmentWeightStatistics(data){
  let url = "/statistics/getSegmentWeightStatistics"
  return request.get(url,data)
}
// 实时监控列表
export function monitoringList(data){
  let url = "/medical/mwMonitorDevice/list"
  return request.get(url,data)
}
// 调取监控要用的token/medical/mwMonitorDevice/getJSession
export function getJSession(){
  let url = "/medical/mwMonitorDevice/getJSession"
  return request.get(url)
}
// 添加监控设备 
export function addMonitor(data){
  let url = "/medical/mwMonitorDevice/add"
  return request.post(url,data)
}
// 编辑监控设备
export function editMonitor(data){
  let url = "/medical/mwMonitorDevice/edit"
  return request.post(url,data)
}
// 删除监控设备
export function deleteMonitor(data){
  let url = "/medical/mwMonitorDevice/delete"
  return request.post(url,data)
}
// 系统管理登录查询  /backend/medical/mwDeviceValidateRecord/list
export function systemLoginList(data){
  let url = "/medical/mwDeviceValidateRecord/list"
  return request.get(url,data)
}
// 获取厂商
export function deviceAgent(data){
  let url = "/medical/mwDeviceAgent/list"
  return request.get(url,data)
} 
// 获取所有硬件列表
export function hardwareList(data){
  let url = "/medical/mwDeviceAgentDevice/list"
  return request.get(url,data)
}
// 新增厂商状态码 medical/mwDeviceAgentDevice/addBatch
export function addBatch(data){
  let url = "/medical/mwDeviceAgentDevice/addBatch"
  return request.post(url,data)
}
// 删除厂商状态码 /medical/mwDeviceAgentDevice/delete
export function delBatch(data){
  let url = "/medical/mwDeviceAgentDevice/delete"
  return request.post(url,data)
}
// 移动厂商状态码 /backend/medical/mwDeviceAgentDevice/move
export function moveBatch(data){
  let url = "/medical/mwDeviceAgentDevice/move"
  return request.post(url,data)
}