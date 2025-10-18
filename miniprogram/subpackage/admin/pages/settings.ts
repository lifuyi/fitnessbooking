// admin/settings.ts
import { showToast, showModal } from '../../../utils/util-complete'
import { adminApi } from '../../../utils/api-complete'
const i18n = require('../../../utils/i18n.js')

const app = getApp<IAppOption>()

Component({
  data: {
    // 管理员信息
    adminInfo: null as any,
    
    // 系统设置
    settings: {
      // 通知设置
      notifications: {
        bookingReminder: true,    // 预约提醒
        classReminder: true,      // 上课前提醒
        cancelReminder: true,     // 取消课程提醒
        systemUpdate: true        // 系统更新通知
      },
      
      // 课程设置
      courses: {
        advanceBookingDays: 7,    // 提前预约天数
        cancelDeadline: 2,        // 取消课程截止时间（小时）
        maxDailyClasses: 5,       // 每日最大课程数
        autoCancel: true          // 自动取消未签到课程
      },
      
      // 门店设置
      stores: {
        defaultStore: '南山店',   // 默认门店
        allowCrossStore: true,    // 允许跨门店预约
        storeSwitchLimit: 3       // 门店切换次数限制
      },
      
      // 系统设置
      system: {
        dataRetention: 90,        // 数据保留天数
        maintenanceMode: false,   // 维护模式
        debugMode: false          // 调试模式
      }
    },
    
    // 版本信息
    version: {
      current: '1.3.0',
      latest: '1.3.0',
      updateAvailable: false
    },
    
    // 加载状态
    loading: false,
    
    // 保存状态
    saving: false,
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.checkAdminLogin()
      this.loadAdminInfo()
      this.loadSettings()
      this.checkVersion()
    }
  },
  
  methods: {
    // 检查管理员登录状态
    checkAdminLogin() {
      const adminToken = wx.getStorageSync('adminToken')
      const adminInfo = wx.getStorageSync('adminInfo')
      
      if (!adminToken || !adminInfo) {
        showToast('请先登录')
        wx.redirectTo({
          url: '/subpackage/admin/pages/login'
        })
        return
      }
      
      // 更新全局状态
      app.globalData.token = adminToken
      app.globalData.userInfo = adminInfo
      app.globalData.isLogin = true
      app.globalData.userRole = 'admin'
    },
    
    // 加载管理员信息
    async loadAdminInfo() {
      try {
        const adminInfo = wx.getStorageSync('adminInfo')
        this.setData({ adminInfo })
      } catch (error) {
        console.error('加载管理员信息失败:', error)
      }
    },
    
    // 加载系统设置
    async loadSettings() {
      try {
        this.setData({ loading: true })
        
        // 模拟API调用
        const settings = {
          notifications: {
            bookingReminder: wx.getStorageSync('setting_bookingReminder') !== false,
            classReminder: wx.getStorageSync('setting_classReminder') !== false,
            cancelReminder: wx.getStorageSync('setting_cancelReminder') !== false,
            systemUpdate: wx.getStorageSync('setting_systemUpdate') !== false
          },
          courses: {
            advanceBookingDays: wx.getStorageSync('setting_advanceBookingDays') || 7,
            cancelDeadline: wx.getStorageSync('setting_cancelDeadline') || 2,
            maxDailyClasses: wx.getStorageSync('setting_maxDailyClasses') || 5,
            autoCancel: wx.getStorageSync('setting_autoCancel') !== false
          },
          stores: {
            defaultStore: wx.getStorageSync('setting_defaultStore') || '南山店',
            allowCrossStore: wx.getStorageSync('setting_allowCrossStore') !== false,
            storeSwitchLimit: wx.getStorageSync('setting_storeSwitchLimit') || 3
          },
          system: {
            dataRetention: wx.getStorageSync('setting_dataRetention') || 90,
            maintenanceMode: wx.getStorageSync('setting_maintenanceMode') === true,
            debugMode: wx.getStorageSync('setting_debugMode') === true
          }
        }
        
        this.setData({ 
          settings,
          loading: false 
        })
      } catch (error) {
        console.error('加载系统设置失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 检查版本更新
    async checkVersion() {
      try {
        // 模拟API调用
        const version = {
          current: '1.3.0',
          latest: '1.3.0',
          updateAvailable: false
        }
        
        this.setData({ version })
      } catch (error) {
        console.error('检查版本失败:', error)
      }
    },
    
    // 切换通知设置
    toggleNotification(e: any) {
      const { field } = e.currentTarget.dataset
      const { notifications } = this.data.settings
      
      this.setData({
        [`settings.notifications.${field}`]: !notifications[field]
      })
    },
    
    // 切换课程设置
    toggleCourseSetting(e: any) {
      const { field } = e.currentTarget.dataset
      const { courses } = this.data.settings
      
      this.setData({
        [`settings.courses.${field}`]: !courses[field]
      })
    },
    
    // 切换门店设置
    toggleStoreSetting(e: any) {
      const { field } = e.currentTarget.dataset
      const { stores } = this.data.settings
      
      this.setData({
        [`settings.stores.${field}`]: !stores[field]
      })
    },
    
    // 切换系统设置
    toggleSystemSetting(e: any) {
      const { field } = e.currentTarget.dataset
      const { system } = this.data.settings
      
      // 维护模式需要二次确认
      if (field === 'maintenanceMode' && !system[field]) {
        showModal('提示', '开启维护模式后，用户将无法正常使用小程序，确定要开启吗？')
          .then(() => {
            this.setData({
              [`settings.system.${field}`]: !system[field]
            })
          })
          .catch(() => {
            // 用户取消，不做任何操作
          })
      } else {
        this.setData({
          [`settings.system.${field}`]: !system[field]
        })
      }
    },
    
    // 修改数值设置
    changeNumberSetting(e: any) {
      const { category, field, min, max } = e.currentTarget.dataset
      const value = parseInt(e.detail.value)
      
      if (value < min || value > max) {
        showToast(`请输入${min}-${max}之间的数值`)
        return
      }
      
      this.setData({
        [`settings.${category}.${field}`]: value
      })
    },
    
    // 修改默认门店
    changeDefaultStore(e: any) {
      const stores = ['南山店', '福田店', '宝安店']
      const index = parseInt(e.detail.value)
      
      this.setData({
        'settings.stores.defaultStore': stores[index]
      })
    },
    
    // 保存设置
    async saveSettings() {
      try {
        this.setData({ saving: true })
        
        const { settings } = this.data
        
        // 保存到本地存储
        wx.setStorageSync('setting_bookingReminder', settings.notifications.bookingReminder)
        wx.setStorageSync('setting_classReminder', settings.notifications.classReminder)
        wx.setStorageSync('setting_cancelReminder', settings.notifications.cancelReminder)
        wx.setStorageSync('setting_systemUpdate', settings.notifications.systemUpdate)
        
        wx.setStorageSync('setting_advanceBookingDays', settings.courses.advanceBookingDays)
        wx.setStorageSync('setting_cancelDeadline', settings.courses.cancelDeadline)
        wx.setStorageSync('setting_maxDailyClasses', settings.courses.maxDailyClasses)
        wx.setStorageSync('setting_autoCancel', settings.courses.autoCancel)
        
        wx.setStorageSync('setting_defaultStore', settings.stores.defaultStore)
        wx.setStorageSync('setting_allowCrossStore', settings.stores.allowCrossStore)
        wx.setStorageSync('setting_storeSwitchLimit', settings.stores.storeSwitchLimit)
        
        wx.setStorageSync('setting_dataRetention', settings.system.dataRetention)
        wx.setStorageSync('setting_maintenanceMode', settings.system.maintenanceMode)
        wx.setStorageSync('setting_debugMode', settings.system.debugMode)
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        showToast('保存成功', 'success')
        this.setData({ saving: false })
      } catch (error) {
        console.error('保存设置失败:', error)
        showToast('保存失败，请重试')
        this.setData({ saving: false })
      }
    },
    
    // 重置设置
    resetSettings() {
      showModal('提示', '确定要重置所有设置为默认值吗？')
        .then(async () => {
          try {
            this.setData({ loading: true })
            
            // 清除本地存储
            wx.removeStorageSync('setting_bookingReminder')
            wx.removeStorageSync('setting_classReminder')
            wx.removeStorageSync('setting_cancelReminder')
            wx.removeStorageSync('setting_systemUpdate')
            wx.removeStorageSync('setting_advanceBookingDays')
            wx.removeStorageSync('setting_cancelDeadline')
            wx.removeStorageSync('setting_maxDailyClasses')
            wx.removeStorageSync('setting_autoCancel')
            wx.removeStorageSync('setting_defaultStore')
            wx.removeStorageSync('setting_allowCrossStore')
            wx.removeStorageSync('setting_storeSwitchLimit')
            wx.removeStorageSync('setting_dataRetention')
            wx.removeStorageSync('setting_maintenanceMode')
            wx.removeStorageSync('setting_debugMode')
            
            // 重新加载默认设置
            await this.loadSettings()
            
            showToast('重置成功', 'success')
          } catch (error) {
            console.error('重置设置失败:', error)
            showToast('重置失败，请重试')
          }
        })
        .catch(() => {
          // 用户取消，不做任何操作
        })
    },
    
    // 检查更新
    checkForUpdate() {
      showToast('正在检查更新...')
      
      // 模拟检查更新
      setTimeout(() => {
        showModal('检查结果', '当前已是最新版本')
          .catch(() => {
            // 用户点击确定
          })
      }, 1500)
    },
    
    // 清除缓存
    clearCache() {
      showModal('提示', '确定要清除系统缓存吗？')
        .then(() => {
          try {
            // 清除部分缓存（保留重要数据）
            wx.removeStorageSync('courseListCache')
            wx.removeStorageSync('teacherListCache')
            wx.removeStorageSync('statisticsCache')
            
            showToast('缓存清除成功', 'success')
          } catch (error) {
            console.error('清除缓存失败:', error)
            showToast('清除失败，请重试')
          }
        })
        .catch(() => {
          // 用户取消，不做任何操作
        })
    },
    
    // 导出数据
    exportData() {
      showToast('正在准备导出数据...')
      
      // 模拟导出数据
      setTimeout(() => {
        showToast('数据导出成功', 'success')
      }, 1500)
    },
    
    // 退出登录
    logout() {
      showModal('提示', '确定要退出登录吗？')
        .then(() => {
          // 清除管理员登录信息
          wx.removeStorageSync('adminToken')
          wx.removeStorageSync('adminInfo')
          
          // 清除全局状态
          app.globalData.token = ''
          app.globalData.userInfo = undefined
          app.globalData.isLogin = false
          app.globalData.userRole = 'student'
          
          // 跳转到登录页
          wx.redirectTo({
            url: '/subpackage/admin/pages/login'
          })
          
          showToast('已退出登录')
        })
        .catch(() => {
          // 用户取消，不做任何操作
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