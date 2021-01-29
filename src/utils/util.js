import store from '@/store';
// 检查指定的权限是否存在
export function checkPermission(key) {
    // 暂时用Storage, 后期优化
    let permissionKeyList = uni.getStorageSync('cache:user:permission:key:list');
    console.log(permissionKeyList);
    return permissionKeyList.findIndex(i => i == key) > -1;
}

// 检查指定的权限是否存在
export function checkPermissionAny(keys) {
    // 暂时用Storage, 后期优化
    let permissionKeyList = uni.getStorageSync('cache:user:permission:key:list');
    for (let keyIndex in keys) {
        if (permissionKeyList.findIndex(i => i == keys[keyIndex]) > -1) {
            return true;
        }
    }
    return false;
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

// 数组分片
export function chunk(list, size,) {
    if(list.length <= 0 || size <= 0){
      return list;
    }
 
    let chunks = [];
 
    for(let i = 0; i < list.length; i = i + size) {
        chunks.push(list.slice(i, i + size));
    }
 
    return chunks
}