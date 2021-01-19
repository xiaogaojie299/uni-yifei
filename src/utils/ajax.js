import { setCache, getCache } from '@/utils/util';
class Ajax {
    //定义baseURL
    constructor(parms) {
        this.baseURL = parms.baseURL
    }
  
    // get 请求
    get(url, data) {
        return this.ajax('GET', url, data)
    }
  
    // post 请求
    post(url, data, type) {
        return this.ajax('POST', url, data, type)
    }
    /**
     * 
     * 公共请求方法
     * 
     * 
     * data中追加缓存配置，为防止与接口冲突，该类型的字段前缀为：SLKEY_ 
     * SLKEY == SmallApp Local Key
     * 
     * 缓存标识符为 slkey_cache_key
     * 缓存有效期为 slkey_cache_timeout, 单位：秒
     * 定义某个接口的缓存KEY和缓存时间
     * 
     */
    ajax(method, url, data, type) {
        // 修饰一下，data必须是一个对象
        data = data == null ? {} : data;
        wx.showLoading({
            title: '加载中',
            mask: false
        })
        // 检查该接口是否指定了缓存
        return new Promise((resolve, reject) => {
            if (data.slkey_cache_key) {
                let responseData = getCache(data.slkey_cache_key);
                if (responseData) {
                    wx.hideLoading()
                    resolve(responseData);
                    return ;
                }
            }
            uni.request({
                url: this.baseURL + url,
                data,
                header: {
                    "X-Access-Token":uni.getStorageSync("token"),
                    "content-type": type||"application/json"
                },
                method,
                dataType: 'json',
                responseType: 'text',
                success: res => {
                    if(res.data.code==202){
                        uni.navigateTo({
                            path:"../pages/login/index.vue"
                        })
                    } else {
                        // 这里要处理一下，如果有缓存标记，处理一下缓存
                        if (res.data.code == 200 && data.slkey_cache_key) {
                            setCache(data.slkey_cache_key, res.data, data.slkey_cache_timeout || 3600)
                        }
                        if (res.data.code != 200) {
                            uni.showToast({
                                title: res.data.message,
                                icon: 'none'
                            })
                        }
                        resolve(res.data)
                    }

                },
                fail: err => {
                    wx.showToast({
                      title: '网络错误',
                      icon:"none"
                    })
                    reject(err)
                },
                complete: res => {
                    wx.hideLoading()
                }
            })
        })
    }
  }
  
  const ajax = new Ajax({
    //   baseURL:"http://192.168.0.101:7001/backend"
      baseURL:"http://47.108.162.242:8080/backend"
  })
  
  /**
  *  全部导出  ajax.get() 调用
  */
  export default ajax
  
  /**
  *  单个导出 解构赋值 { getBanner } 调用
  */