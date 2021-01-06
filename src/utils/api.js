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

/**  公共接口  */

// 获取医院的科室列表
export function getMyOfficeCascadeList(data) {
  let url = "/system/sysDepartment/getMyOfficeCascadeListV2";
  return request.get(url, data)
}
// 获取医废类型
export function getWasteTypeList(data) {
  let url = "/system/sysDict/getWasteTypeList";
  return request.get(url, data);
}

/** 医废相关接口 */

// 医废溯源列表 
export function listHistoryMedicalTrace(data) {
  return request.get('/medical/mwCollectRecord/listHistory', data);
}
// 获取医废流转过程
export function getMedicalTraceRecord(data) {
  return request.get('/medical/mwCollectRecord/getRecordDetail', data);
}
// 删除医废信息
export function deleteMedicalTrace(data) {
  return request.post('/medical/mwCollectRecord/delete', data);
}

// 收集记录页面

// 获取收集列表
export function listMedicalTrace(data) {
  return request.get('/medical/mwCollectRecord/list', data);
}
// 获取收集信息详情
export function detailMedicalTrace(data) {
  return request.get('/medical/mwCollectRecord/queryById', data);
}

// 入出库记录页面
// 获取入库记录
export function listStoreMedicalTrace(data) {
  return request.get('/medical/mwCollectRecord/listStore', data);
}
// 获取出库记录
export function listCheckoutMedicalTrace(data) {
  return request.get('/medical/mwCollectRecord/listCheckout', data);
}

// 出库配置页

// 获取出库配置列表
export function listTransitConfig(data) {
  return request.get('/medical/mwTransitConfig/list', data);
}
// 添加出库配置
export function addTransitConfig(data) {
  return request.get('/medical/mwTransitConfig/list', data);
}
// 编辑出库配置
export function editTransitConfig(data) {
  return request.get('/medical/mwTransitConfig/list', data);
}
// 删除出库配置
export function deleteTransitConfig(data) {
  return request.get('/medical/mwTransitConfig/list', data);
}

// 医废补录页
// 获取医废补录列表
export function listSupplementMedicalTrace(data) {
  return request.get('/medical/mwCollectRecord/listSupplement', data);
}
// 审核医废补录记录
export function auditSupplementMedicalTrace(data) {
  return request.post('/medical/mwCollectRecord/auditSupplement', data);
}
// 新增医废补录
export function addSupplementMedicalTrace(data) {
  return request.post('/medical/mwCollectRecord/supply', data);
}


// 数据恢复页面

// 获取医废删除列表
export function getMedicalTraceListDelete(data) {
  return request.get('/medical/mwCollectRecord/listDelete', data);
}
// 恢复已删除的医废信息
export function restoreMedicalTrace(data) {
  return request.post('/medical/mwCollectRecord/restore', data);
}
