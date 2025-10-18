// profile/index.ts
import { showToast, showModal, formatTime } from '../../utils/util-complete'
import { courseApi, userApi } from '../../utils/api-complete'
const i18n = require('../../utils/i18n.js')
import type { Booking, UserCourseCard } from '../../utils/types'

const app = getApp<IAppOption>()

Component({
  data: {
    // 用户信息
    userInfo: null as any,
    
    // 我的预约
    bookings: [] as Booking[],
    
    // 我的课程卡
    courseCards: [] as UserCourseCard[],
    
    // 加载状态
    loading: true,
    
    // 预约状态筛选
    bookingStatus: 'upcoming' as 'upcoming' | 'completed' | 'cancelled',
    
    // 分页信息
    page: 1,
    limit: 10,
    hasMore: true,
    
    // 国际化
    i18n: i18n,
    
    // 当前门店
    currentStore: '南山店'
  },
  
  lifetimes: {
    attached() {
      this.setData({ loading: true })
      
      Promise.all([
        this.loadUserInfo(),
        this.loadBookings(),
        this.loadCourseCards()
      ]).finally(() => {
        this.setData({ loading: false })
      })
    }
  },
  
  pageLifetimes: {
    show() {
      // 页面显示时刷新用户信息
      this.loadUserInfo().then(() => {
        // 如果已登录，刷新相关数据
        if (app.globalData.isLogin) {
          Promise.all([
            this.loadBookings(),
            this.loadCourseCards()
          ]).catch(error => {
            console.error('刷新数据失败:', error)
          })
        }
      })
    }
  },
  
  methods: {
    // 加载用户信息
    loadUserInfo() {
      return new Promise<void>((resolve) => {
        const userInfo = app.globalData.userInfo
        
        if (userInfo) {
          this.setData({ userInfo })
        }
        
        resolve()
      })
    },

    // 微信登录
    wxLogin() {
      const app = getApp<IAppOption>()
      
      if (app.globalData.isLogin) {
        return
      }
      
      const { showToast } = require('../../utils/util-complete')
      
      this.setData({ loading: true })
      
      // 直接调用getUserProfile获取用户信息
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (profileRes) => {
          const userInfo = profileRes.userInfo
          
          // 获取微信登录凭证
          wx.login({
            success: (loginRes) => {
              if (loginRes.code) {
                // 调用app中的登录方法
                app.wxLoginWithUserInfo(loginRes.code, userInfo)
                  .then((res: any) => {
                    showToast('登录成功', 'success')
                    this.setData({ userInfo: res.userInfo })
                    
                    // 登录成功后，加载用户数据
                    Promise.all([
                      this.loadBookings(true),
                      this.loadCourseCards()
                    ]).finally(() => {
                      this.setData({ loading: false })
                    })
                  })
                  .catch((error: any) => {
                    console.error('登录失败:', error)
                    showToast('登录失败，请重试', 'error')
                    this.setData({ loading: false })
                  })
              } else {
                showToast('获取登录凭证失败', 'error')
                this.setData({ loading: false })
              }
            },
            fail: (error) => {
              console.error('微信登录失败:', error)
              showToast('微信登录失败', 'error')
              this.setData({ loading: false })
            }
          })
        },
        fail: (error) => {
          console.error('获取用户信息失败:', error)
          showToast('获取用户信息失败', 'error')
          this.setData({ loading: false })
        }
      })
    },
    
    // 加载我的预约
    async loadBookings(reset = false) {
      try {
        const { page, limit, bookingStatus } = this.data
        const currentPage = reset ? 1 : page
        
        const result = await courseApi.getMyBookings({
          status: bookingStatus,
          page: currentPage,
          limit
        })
        
        this.setData({
          bookings: reset ? result.list : [...this.data.bookings, ...result.list],
          page: currentPage + 1,
          hasMore: result.hasMore
        })
      } catch (error) {
        console.error('加载预约记录失败:', error)
      }
    },
    
    // 加载我的课程卡
    async loadCourseCards() {
      try {
        // 模拟API调用
        const courseCards = [
          {
            userCardId: 'uc1',
            cardId: 'c1',
            cardName: '爵士舞次卡',
            userId: app.globalData.userId,
            danceType: '爵士舞',
            remainingCount: 5,
            totalCount: 10,
            purchaseTime: '2023-10-01',
            expireTime: '2024-01-01',
            status: 'active'
          },
          {
            userCardId: 'uc2',
            cardId: 'c2',
            cardName: '韩舞次卡',
            userId: app.globalData.userId,
            danceType: '韩舞',
            remainingCount: 3,
            totalCount: 5,
            purchaseTime: '2023-10-15',
            expireTime: '2023-12-15',
            status: 'active'
          }
        ]
        
        this.setData({ courseCards })
      } catch (error) {
        console.error('加载课程卡失败:', error)
      }
    },
    
    // 切换预约状态
    switchBookingStatus(e: any) {
      const { status } = e.currentTarget.dataset
      
      this.setData({
        bookingStatus: status,
        page: 1,
        hasMore: true
      })
      
      this.loadBookings(true)
    },
    
    // 取消预约
    async cancelBooking(e: any) {
      const { bookingId } = e.currentTarget.dataset
      
      try {
        const confirmed = await showModal('确定要取消预约吗？')
        if (!confirmed) return
        
        // 调用取消预约接口
        await courseApi.cancelBooking(bookingId)
        
        showToast('取消成功', 'success')
        
        // 刷新预约列表
        this.setData({
          page: 1,
          hasMore: true
        })
        this.loadBookings(true)
      } catch (error) {
        console.error('取消预约失败:', error)
      }
    },
    
    // 跳转到课程详情
    navigateToCourseDetail(e: any) {
      const { courseId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/course/detail?courseId=${courseId}`
      })
    },
    
    // 显示入场码
    showQRCode() {
      if (!app.globalData.isLogin) {
        showToast('请先登录')
        return
      }
      
      wx.navigateTo({
        url: '/pages/qrcode/index'
      })
    },
    
    // 联系客服
    contactCustomerService() {
      // 这里可以调用微信客服接口或其他联系方式
      wx.showModal({
        title: '联系客服',
        content: '客服电话：19925187494\n客服微信：icondance',
        showCancel: false
      })
    },
    
    // 退出登录
    async logout() {
      try {
        const confirmed = await showModal('确定要退出登录吗？')
        if (!confirmed) return
        
        // 调用退出登录接口
        await userApi.logout()
        
        // 清除本地登录状态
        app.logout()
        
        // 清除页面数据
        this.setData({
          userInfo: null,
          bookings: [],
          courseCards: []
        })
        
        showToast('已退出登录')
        
        // 跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        })
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },
    
    // 格式化预约时间
    formatBookingTime(booking: Booking) {
      const courseDate = new Date(`${booking.date} ${booking.startTime}`)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const courseDay = new Date(courseDate.getFullYear(), courseDate.getMonth(), courseDate.getDate())
      
      const dayDiff = Math.floor((courseDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
      
      if (dayDiff === 0) {
        return `今天 ${booking.startTime}-${booking.endTime}`
      } else if (dayDiff === 1) {
        return `明天 ${booking.startTime}-${booking.endTime}`
      } else if (dayDiff === -1) {
        return `昨天 ${booking.startTime}-${booking.endTime}`
      } else {
        return `${booking.date.split('-').slice(1).join('-')} ${booking.startTime}-${booking.endTime}`
      }
    },
    
    // 获取预约状态文本
    getBookingStatusText(status: string) {
      switch (status) {
        case 'booked':
          return '待上课'
        case 'completed':
          return '已完成'
        case 'cancelled':
          return '已取消'
        case 'no_show':
          return '未到场'
        default:
          return '未知'
      }
    },
    
    // 获取预约状态样式
    getBookingStatusClass(status: string) {
      switch (status) {
        case 'booked':
          return 'status-primary'
        case 'completed':
          return 'status-success'
        case 'cancelled':
          return 'status-warning'
        case 'no_show':
          return 'status-error'
        default:
          return 'status-default'
      }
    },
    
    // 获取课程卡状态文本
    getCourseCardStatusText(status: string) {
      switch (status) {
        case 'active':
          return '有效'
        case 'expired':
          return '已过期'
        case 'used_up':
          return '已用完'
        default:
          return '未知'
      }
    },
    
    // 获取课程卡状态样式
    getCourseCardStatusClass(status: string) {
      switch (status) {
        case 'active':
          return 'status-success'
        case 'expired':
          return 'status-warning'
        case 'used_up':
          return 'status-error'
        default:
          return 'status-default'
      }
    },
    
    // 加载更多预约
    loadMore() {
      if (this.data.hasMore && !this.data.loading) {
        this.loadBookings()
      }
    },
    
    // 跳转到我的预约页面
    navigateToBookings() {
      wx.navigateTo({
        url: '/pages/booking/index'
      })
    },
    
    // 跳转到我的课程卡页面
    navigateToCourseCards() {
      wx.navigateTo({
        url: '/pages/cards/index'
      })
    },
    
    // 跳转到设置页面
    navigateToSettings() {
      wx.navigateTo({
        url: '/pages/settings/index'
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
      
      // 更新tabBar语言
      const { setTabBarLanguage } = require('../../utils/language.js')
      setTabBarLanguage()
    },
    
    // 翻译文本
    t(key: string, params: any = {}) {
      return this.data.i18n.t(key, params)
    },
    
    // 语言切换事件处理
    onLanguageChange() {
      // 重新获取最新的i18n实例
      const i18nInstance = require('../../utils/i18n.js')
      
      // 更新页面的i18n实例
      this.setData({
        i18n: i18nInstance
      })
      
      // 重新加载页面数据以更新显示
      this.loadUserData()
    }
  }
})