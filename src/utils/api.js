import request from "./ajax";
/* 
  >>>>>>>>>>>> 公共模块<<<<<<<<<<<<
*/
// 获取 省，市，区，科室，门诊(树状图默认数据)
export function getMyDepartmentTreeList(){
  return request.get('/system/sysDepartment/getMyDepartmentTreeList');
}

/* 登录模块 */
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
export function getTodayRankList(params){
  let url = "/index/getTodayRankStatistics";
  return request.get(url,params);
}
// getLastSevenDaysStatistics
export function getLastSevenDaysStatistics(params){
  let url = "/index/getLastSevenDaysStatistics";
  return request.get(url,params);
}

// getLastSevenDaysStatisticsX  ，
export function getLastSevenDaysStatisticsX(params){
  let url = "/index/getLastSevenDaysStatisticsX";
  return request.get(url,params);
}

// 获取未处理预警

/* ------------- */

/* 统计报表模块 */

// 获取医院级联
export function getMyHospitalCascadeList(){
  let data = {
    slkey_cache_key: 'hospital:cascade:list',
    slkey_cache_timeout: 3600
  };
  let url = "/system/sysDepartment/getMyHospitalCascadeList";
  
  return request.get(url, data)
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
// 获取科室人员列表
export function getMyOfficeUserList(data) {
  let url = "/system/user/getOfficeUserList";
  return request.get(url, data)
}
// 获取暂存间列表
export function getMyWarehouseOfficeList(data) {
  let url = "/system/sysDepartment/getMyWarehouseOfficeList";
  return request.get(url, data)
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
// 获取收集轨迹
export function collectTrajectory(data) {
  return request.get('/medical/mwCollectRecord/collectTrajectory', data);
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
  return request.post('/medical/mwTransitConfig/list', data);
}
// 添加出库配置
export function addTransitConfig(data) {
  return request.post('/medical/mwTransitConfig/add', data);
}
// 编辑出库配置
export function editTransitConfig(data) {
  return request.post('/medical/mwTransitConfig/edit', data);
}
// 删除出库配置
export function deleteTransitConfig(data) {
  return request.post('/medical/mwTransitConfig/delete', data);
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

// 预警信息
// 获取预警信息列表
export function listWarningRecord(data) {
  return request.get('/medical/mwWarningRecord/list', data);
}
// 获取预警处理列表
export function listWarningRecordHandle(data) {
  return request.get('/medical/mwWarningRecordHandle/list', data);
}
// 提交预警处理
export function handleWarningRecordHandle(data) {
  return request.post('/medical/mwWarningRecordHandle/handle', data);
}

// 预警配置
// 获取预警配置信息
export function detailWarningConfigType(data) {
  return request.get('/medical/mwWarningConfig/getByType', data);
}

// 编辑预警配置
export function editWarningConfigType(data) {
  return request.post('/medical/mwWarningConfig/editByType', data);
}

// 获取预警数据项列表
export function listWarningConfigItem(data) {
  return request.get('/medical/mwWarningConfigItem/listByType', data);
}
// 添加预警数据项列表
export function addWarningConfigItem(data) {
  return request.post('/medical/mwWarningConfigItem/add', data);
}
// 编辑预警数据项
export function editWarningConfigItem(data) {
  return request.post('/medical/mwWarningConfigItem/edit', data);
}
export function removeWarningConfigItem(data) {
  return request.post('/medical/mwWarningConfigItem/delete', data);
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
// 禁用删除厂商 /medical/mwDeviceAgentDevice/updateStatus
export function updateStatus(data){
  let url = "/medical/mwDeviceAgentDevice/updateStatus"
  return request.post(url,data)
}
// 移动厂商状态码 /backend/medical/mwDeviceAgentDevice/move
export function moveBatch(data){
  let url = "/medical/mwDeviceAgentDevice/move"
  return request.post(url,data)
}

// 添加厂商 backend/medical/mwDeviceAgent/add
export function addVendor(data){
  let url = "/medical/mwDeviceAgent/add"
  return request.post(url,data)
}
// 编辑厂商 backend/medical/mwDeviceAgent/add
export function editVendor(data){
  let url = "/medical/mwDeviceAgent/edit"
  return request.post(url,data)
}
// 删除厂商 backend/medical/mwDeviceAgent/add
export function deleteVendor(data){
  let url = "/medical/mwDeviceAgent/delete"
  return request.post(url,data)
}
// 获取组织架构后的科室 sysDepartment/listRegionChildren?
export function listRegion(data){
  return request.get('/system/sysDepartment/listRegion',data)
}
// 获取组织架构后的科室 sysDepartment/listRegionChildren?
export function listRegionChildren(data){
  return request.get('/system/sysDepartment/listRegionChildren',data)
}
// 获取组织树
export function sysDepartmentTreeList(){
  return request.get('/system/sysDepartment/sysDepartmentTreeList')
}
// 获取父组织
export function getParent(data){
  return request.get("/system/sysUserDepartment/queryById",data)
}
// 编辑组织
export function sysDepartmentEdit(data){
  return request.post("/system/sysDepartment/edit",data)
}
// 获取单位名称
export function unitData(){
  return request.get("/system/sysDict/getDepartmentTypeList")
}

/* 用户管理 */
export function userList(data){
  return request.get("/system/user/list",data)
}
// 用户管理获取角色 backend/system/sysRole/list
export function sysRole(data){
  return request.get('/system/sysRole/list',data)
}

// 删除用户管理员
export function userDel(data){
  return request.post('/system/user/delete',data)
}
// 禁用用户
export function userBatch(data){
  return request.post("/system/user/frozenBatch",data)
}

// 编辑用户
export function userEdit(data){
  return request.post("/system/user/edit",data)
}
/* 角色管理 */
// 查询角色
export function sysRoleList(data){
  return request.get("/system/sysRole/list",data)
}
// 编辑角色信息
export function editSysRole(data){
  return request.put("/system/sysRole/edit",data)
}
// 修改角色logo
export function uploadRoleLOGO(data){
  return request.post("/system/sysRole/uploadLogo",data)
}
// 角色配置 sysRole/queryTreeList
export function getRootTreeList(data){
  return request.get("/system/sysRole/queryTreeList",data)
}
// 角色可用的权限 sysPermission/queryRolePermission
export function getRolePermission(data){
  return request.get("/system/sysPermission/queryRolePermission",data)
}
// 编辑角色可用的权限
export function saveRolePermission(data){
  return request.post("/system/sysPermission/saveRolePermission",data)
}
// 删除角色
export function delRole(data){ //sysRole/delete
  return request.delete("/system/sysRole/delete?id="+data)
}
// 添加角色 sysRole/add
export function addRole(data){
  return request.post("/system/sysRole/add",data)
}