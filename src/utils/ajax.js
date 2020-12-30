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
    post(url, data,type) {
        return this.ajax('POST', url, data,type)
    }
    // 公共请求方法
    ajax(method, url, data,type) {
        wx.showLoading({
            title: '加载中',
            mask: false
        })
        return new Promise((resolve, reject) => {
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
                        wx.navigateTo({
                            path:"../pages/login/index.vue"
                        })
                    }else{
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
      baseURL:"http://47.108.162.242/backend"
  })
  
  /**
  *  全部导出  ajax.get() 调用
  */
  export default ajax
  
  /**
  *  单个导出 解构赋值 { getBanner } 调用
  */