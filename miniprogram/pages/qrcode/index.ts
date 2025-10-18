// qrcode/index.ts
import { showToast } from '../../../utils/util'
const i18n = require('../../../utils/i18n.js')

const app = getApp<IAppOption>()

Component({
  data: {
    // 用户信息
    userInfo: null as any,
    
    // 二维码内容
    qrCodeContent: '',
    
    // 倒计时
    countdown: 30,
    
    // 定时器
    timer: null as number | null,
    
    // 加载状态
    loading: false,
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.loadUserInfo()
      this.generateQRCode()
      this.startCountdown()
    },
    
    detached() {
      this.clearTimer()
    }
  },
  
  methods: {
    // 加载用户信息
    loadUserInfo() {
      const userInfo = app.globalData.userInfo
      
      if (userInfo) {
        this.setData({ userInfo })
      } else {
        showToast('请先登录')
        wx.navigateBack()
      }
    },
    
    // 生成二维码
    generateQRCode() {
      const userInfo = this.data.userInfo
      
      if (!userInfo) return
      
      // 生成二维码内容（这里应该包含用户ID、时间戳等信息）
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const qrCodeContent = `USER:${userInfo.userId}|TIME:${timestamp}|RAND:${random}`
      
      this.setData({
        qrCodeContent,
        loading: false
      })
    },
    
    // 开始倒计时
    startCountdown() {
      this.clearTimer()
      
      const timer = setInterval(() => {
        const { countdown } = this.data
        
        if (countdown <= 1) {
          // 倒计时结束，重新生成二维码
          this.generateQRCode()
          this.setData({ countdown: 30 })
        } else {
          this.setData({ countdown: countdown - 1 })
        }
      }, 1000)
      
      this.setData({ timer })
    },
    
    // 清除定时器
    clearTimer() {
      const { timer } = this.data
      
      if (timer) {
        clearInterval(timer)
        this.setData({ timer: null })
      }
    },
    
    // 手动刷新二维码
    refreshQRCode() {
      this.generateQRCode()
      this.setData({ countdown: 30 })
      this.startCountdown()
    },
    
    // 返回上一页
    navigateBack() {
      wx.navigateBack()
    },
    
    // 保存二维码到相册
    saveQRCode() {
      wx.showModal({
        title: '提示',
        content: '是否保存二维码到相册？',
        success: (res) => {
          if (res.confirm) {
            // 这里应该实现保存二维码到相册的逻辑
            showToast('保存成功', 'success')
          }
        }
      })
    },
    
    // 语言切换事件处理
    onLanguageChange() {
      this.setData({
        i18n: i18n
      })
    }
  }
})