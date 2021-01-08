import store from '@/store';
// 检查指定的权限是否存在
export function checkPermission(key) {
    // 暂时用Storage, 后期优化
    let permissionKeyList = uni.getStorageSync('cache:user:permission:key:list');
    return permissionKeyList.findIndex(i => i == key) > -1;
}

export function getCache(cache) {
    // 先检查是否已经过期
    let data = uni.getStorageSync('api:cache:' + cache);
    if (data) {
        // 如果存储的过期时间小于当前时间，证明有效
        if (data.slkey_timeout > (new Date().getTime() / 1000)) {
            return data;
        }
    }
    return false;
}
export function setCache(cache, data, timeout) {
    data.slkey_timeout = (new Date().getTime() / 1000) + timeout;
    console.log(cache, data);
    // 检查是否存在
    if (uni.setStorageSync('api:cache:' + cache, data)) {
        return data;
    }
}