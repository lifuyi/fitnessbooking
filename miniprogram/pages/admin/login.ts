// admin/login.ts
import { showToast, showModal } from '../../../utils/util'
import { adminApi } from '../../../utils/api'
const i18n = require('../../../utils/i18n.js')
const app = getApp<IAppOption>()

Component({
  data: {
    // 表单数据
    phone: '',
    code: '',
    
    // 验证码状态
    codeSent: false,
    countdown: 0,
    timer: null as number | null,
    
    // 加载状态
    loading: false,
    
    // 表单验证
    phoneError: '',
    codeError: '',

    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    detached() {
      this.clearTimer()
    }
  },
  
  methods: {
    // 手机号输入
    onPhoneInput(e: any) {
      const phone = e.detail.value
      this.setData({ 
        phone,
        phoneError: ''
      })
    },
    
    // 验证码输入
    onCodeInput(e: any) {
      const code = e.detail.value
      this.setData({ 
        code,
        codeError: ''
      })
    },
    
    // 验证手机号
    validatePhone(phone: string): boolean {
      if (!phone) {
        this.setData({ phoneError: i18n.t('admin.login.phone.error') })
        return false
      }
      
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        this.setData({ phoneError: i18n.t('admin.login.phone.error') })
        return false
      }
      
      return true
    },
    
    // 验证验证码
    validateCode(code: string): boolean {
      const { i18n } = this.data
      if (!code) {
        this.setData({ codeError: i18n.t('admin.login.code.error') })
        return false
      }
      
      if (code.length !== 6) {
        this.setData({ codeError: i18n.t('admin.login.code.error') })
        return false
      }
      
      return true
    },
    
    // 获取验证码
    async sendSmsCode() {
      const { phone } = this.data
      
      // 验证手机号
      if (!this.validatePhone(phone)) {
        return
      }
      
      try {
        // 调用发送验证码接口
        await adminApi.getSmsCode(phone)
        
        showToast('验证码已发送', 'success')
        
        // 开始倒计时
        this.startCountdown()
        
        this.setData({ codeSent: true })
      } catch (error) {
        console.error('发送验证码失败:', error)
        showToast('发送失败，请重试')
      }
    },
    
    // 开始倒计时
    startCountdown() {
      this.clearTimer()
      
      this.setData({ countdown: 60 })
      
      const timer = setInterval(() => {
        const { countdown } = this.data
        
        if (countdown <= 1) {
          this.clearTimer()
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
    
    // 登录
    async login() {
      const { phone, code } = this.data
      
      // 表单验证
      if (!this.validatePhone(phone) || !this.validateCode(code)) {
        return
      }
      
      this.setData({ loading: true })
      
      try {
        // 调用登录接口
        const result = await adminApi.login(phone, code)
        
        // 保存登录信息
        wx.setStorageSync('adminToken', result.token)
        wx.setStorageSync('adminInfo', result.adminInfo)
        
        // 更新全局状态
        app.globalData.token = result.token
        app.globalData.userInfo = result.adminInfo
        app.globalData.isLogin = true
        app.globalData.userId = result.adminInfo.adminId
        app.globalData.userRole = 'admin'
        
        showToast('登录成功', 'success')
        
        // 跳转到管理首页
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/admin/coursemanage'
          })
        }, 1500)
      } catch (error) {
        console.error('登录失败:', error)
        showToast(i18n.t('error.network'))
      } finally {
        this.setData({ loading: false })
      }
    },
    
    // 返回上一页
    navigateBack() {
      wx.navigateBack()
    },
    
    // 忘记密码
    forgetPassword() {
      showModal('请联系管理员重置密码', '忘记密码')
    },
    
    // 跳转到系统设置
    navigateToSettings() {
      wx.navigateTo({
        url: '/pages/admin/settings'
      })
    },
    
    // 切换语言
    switchLanguage() {
      const currentLanguage = this.data.i18n.getLanguage()
      const newLanguage = currentLanguage === 'zh-CN' ? 'en' : 'zh-CN'
      
      this.data.i18n.setLanguage(newLanguage)
      this.setData({
        i18n: this.data.i18n
      })
      
      setTabBarLanguage()
    },
    
    // 翻译文本
    t(key: string, params: any = {}) {
      return this.data.i18n.t(key, params)
    }
  }
})