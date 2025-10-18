// app.ts
const i18nModule = require('./utils/i18n.js')

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    token?: string,
    currentStore?: string,
    isLogin?: boolean,
    userId?: string,
    userRole?: 'student' | 'admin',
    i18n: typeof i18nModule,
    systemInfo?: WechatMiniprogram.SystemInfo
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  checkLoginStatus(): void,
  wxLogin(): Promise<any>,
  wxLoginWithUserInfo(code: string, userInfo: any): Promise<any>,
  simulateApiCall(code: string, userInfo: any): Promise<any>,
  logout(): void,
  switchStore(storeName: string): void
}

App<IAppOption>({
  globalData: {
    userInfo: undefined,
    token: '',
    currentStore: '南山店',
    isLogin: false,
    userId: '',
    userRole: 'student',
    i18n: i18nModule,
  },
  
  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus()
    
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
      }
    })
    
    // 初始化语言设置
    const { initLanguage } = require('./utils/language.js')
    initLanguage()
  },
  
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    if (token && userInfo) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
      this.globalData.isLogin = true
      this.globalData.userId = userInfo.userId || ''
    }
  },
  
  // 微信授权登录（仅处理登录凭证和用户信息）
  wxLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  },

  wxLoginWithUserInfo(code: string, userInfo: any) {
    return new Promise((resolve, reject) => {
      // 调用真实API接口，发送code和userInfo
      const { userApi } = require('./utils/api-complete')
      userApi.wxLogin(code, userInfo)
        .then((res: any) => {
          // 保存登录信息
          wx.setStorageSync('token', res.token)
          wx.setStorageSync('userInfo', res.userInfo)
          
          this.globalData.token = res.token
          this.globalData.userInfo = res.userInfo
          this.globalData.isLogin = true
          this.globalData.userId = res.userInfo.userId
          
          resolve(res)
        })
        .catch((error: any) => {
          console.error('登录失败:', error)
          reject(error)
        })
    })
  },

  simulateApiCall(code: string, userInfo: any): Promise<any> {
    return new Promise((resolve) => {
      // Simulate API response
      setTimeout(() => {
        resolve({
          token: 'mock-token-' + Date.now(),
          userInfo: {
            userId: 'user-' + Date.now(),
            ...userInfo
          }
        })
      }, 1000)
    })
  },
  
  // 退出登录
  logout() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    
    this.globalData.token = ''
    this.globalData.userInfo = undefined
    this.globalData.isLogin = false
    this.globalData.userId = ''
  },
  
  // 切换门店
  switchStore(storeName: string) {
    this.globalData.currentStore = storeName
    wx.setStorageSync('currentStore', storeName)
  }
})