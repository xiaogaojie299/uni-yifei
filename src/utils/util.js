import store from '@/store';
// 检查指定的权限是否存在
export function checkPermission(key) {
    // 暂时用Storage, 后期优化
    let permissionKeyList = uni.getStorageSync('cache:user:permission:key:list');
    return permissionKeyList.findIndex(i => i == key) > -1;
}