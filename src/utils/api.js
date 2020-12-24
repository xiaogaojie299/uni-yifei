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

// 获取我的医院级联
export function getMyHospitalCascadeList(){
  let url = "/system/sysDepartment/getMyHospitalCascadeList";
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

// /system/sysDepartment/getMyHospitalCascadeList