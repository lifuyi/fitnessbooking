// booking/index.ts
import { checkLogin, showToast, showModal, formatTime, isToday, isTomorrow } from '../../utils/util-complete'
import { bookingApi, courseApi } from '../../utils/api-complete'
const i18n = require('../../utils/i18n.js')
import type { Booking, Course } from '../../utils/types'

const app = getApp<IAppOption>()

Component({
  data: {
    // 预约记录
    bookings: [] as Booking[],
    
    // 筛选条件
    currentTab: 0, // 0: 即将上课, 1: 历史记录
    filters: {
      status: 'all', // all, booked, completed, cancelled
      dateRange: 'all' // all, week, month
    },
    
    // 加载状态
    loading: false,
    loadingMore: false,
    
    // 分页
    page: 1,
    pageSize: 10,
    hasMore: true,
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.checkUserLogin()
      this.loadBookings()
    }
  },
  
  pageLifetimes: {
    show() {
      // 页面显示时刷新数据
      this.refreshData()
    },
    
    // 下拉刷新
    onPullDownRefresh() {
      this.refreshData().then(() => {
        wx.stopPullDownRefresh()
      })
    },
    
    // 上拉加载更多
    onReachBottom() {
      if (this.data.hasMore && !this.data.loadingMore) {
        this.loadMoreBookings()
      }
    }
  },
  
  methods: {
    // 检查用户登录状态
    checkUserLogin() {
      const isLogin = checkLogin()
      
      if (!isLogin) {
        showModal('请先登录', '提示')
          .then(() => {
            wx.switchTab({
              url: '/pages/index/index'
            })
          })
          .catch(() => {
            wx.navigateBack()
          })
        return
      }
    },
    
    // 刷新数据
    async refreshData() {
      this.setData({
        page: 1,
        hasMore: true,
        bookings: []
      })
      
      await this.loadBookings()
    },
    
    // 加载预约记录
    async loadBookings() {
      try {
        this.setData({ loading: true })
        
        const { currentTab, filters, page, pageSize } = this.data
        
        // 构建查询参数
        const params: any = {
          page,
          limit: pageSize
        }
        
        // 根据当前标签页设置状态
        if (currentTab === 0) {
          params.status = 'booked'
        } else {
          if (filters.status !== 'all') {
            params.status = filters.status
          }
        }
        
        if (filters.dateRange !== 'all') {
          params.dateRange = filters.dateRange
        }
        
        // 模拟API调用
        const bookings = [
          {
            bookingId: 'b1',
            courseId: 'c1',
            courseName: '爵士舞基础',
            danceTypeName: '爵士舞',
            teacherName: 'BOA',
            teacherAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=200&h=200&fit=crop&crop=face',
            storeName: '南山店',
            date: '2023-10-18',
            startTime: '19:00',
            endTime: '20:30',
            status: 'booked',
            bookingTime: '2023-10-15 10:30:00',
            checkedIn: false
          },
          {
            bookingId: 'b2',
            courseId: 'c2',
            courseName: '韩舞编舞',
            danceTypeName: '韩舞',
            teacherName: 'LISA',
            teacherAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
            storeName: '南山店',
            date: '2023-10-16',
            startTime: '20:00',
            endTime: '21:30',
            status: 'completed',
            bookingTime: '2023-10-14 15:20:00',
            checkedIn: true
          },
          {
            bookingId: 'b3',
            courseId: 'c3',
            courseName: '街舞基础',
            danceTypeName: '街舞',
            teacherName: 'QURY',
            teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
            storeName: '福田店',
            date: '2023-10-14',
            startTime: '18:30',
            endTime: '20:00',
            status: 'cancelled',
            bookingTime: '2023-10-12 09:15:00',
            checkedIn: false,
            cancelTime: '2023-10-13 16:45:00',
            cancelReason: '临时有事'
          }
        ]
        
        // 应用筛选
        let filteredBookings = bookings
        if (filters.status !== 'all' && currentTab === 1) {
          filteredBookings = bookings.filter(booking => booking.status === filters.status)
        }
        
        if (filters.dateRange !== 'all') {
          const now = new Date()
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          
          let startDate = new Date(today)
          if (filters.dateRange === 'week') {
            startDate.setDate(today.getDate() - 7)
          } else if (filters.dateRange === 'month') {
            startDate.setMonth(today.getMonth() - 1)
          }
          
          filteredBookings = filteredBookings.filter(booking => {
            const bookingDate = new Date(booking.date)
            return bookingDate >= startDate
          })
        }
        
        // 分页处理
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const pageBookings = filteredBookings.slice(startIndex, endIndex)
        
        // 合并数据
        const newBookings = page === 1 ? pageBookings : [...this.data.bookings, ...pageBookings]
        
        this.setData({
          bookings: newBookings,
          loading: false,
          hasMore: endIndex < filteredBookings.length,
          page: page + 1
        })
      } catch (error) {
        console.error('加载预约记录失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 加载更多预约记录
    async loadMoreBookings() {
      this.setData({ loadingMore: true })
      
      try {
        await this.loadBookings()
      } finally {
        this.setData({ loadingMore: false })
      }
    },
    
    // 切换标签页
    switchTab(e: any) {
      const currentTab = e.currentTarget.dataset.index
      
      this.setData({
        currentTab,
        filters: {
          status: 'all',
          dateRange: 'all'
        }
      })
      
      this.refreshData()
    },
    
    // 切换状态筛选
    switchStatus(e: any) {
      const index = e.detail.value
      const statuses = ['all', 'completed', 'cancelled']
      const status = statuses[index]
      
      this.setData({
        'filters.status': status
      })
      
      this.refreshData()
    },
    
    // 切换时间筛选
    switchDateRange(e: any) {
      const index = e.detail.value
      const dateRanges = ['all', 'week', 'month']
      const dateRange = dateRanges[index]
      
      this.setData({
        'filters.dateRange': dateRange
      })
      
      this.refreshData()
    },
    
    // 获取状态筛选选项
    getStatusOptions() {
      return ['全部状态', '已完成', '已取消']
    },
    
    // 获取时间筛选选项
    getDateRangeOptions() {
      return ['全部时间', '最近一周', '最近一月']
    },
    
    // 获取当前状态筛选文本
    getCurrentStatusText() {
      const { filters } = this.data
      const options = this.getStatusOptions()
      const index = ['all', 'completed', 'cancelled'].indexOf(filters.status)
      return options[index] || options[0]
    },
    
    // 获取当前时间筛选文本
    getCurrentDateRangeText() {
      const { filters } = this.data
      const options = this.getDateRangeOptions()
      const index = ['all', 'week', 'month'].indexOf(filters.dateRange)
      return options[index] || options[0]
    },
    
    // 取消预约
    cancelBooking(e: any) {
      const { bookingId, courseName } = e.currentTarget.dataset
      
      showModal(`确定要取消「${courseName}」的预约吗？`, '取消预约')
        .then(async () => {
          try {
            // 调用取消预约接口
            await bookingApi.cancelBooking(bookingId)
            
            showToast('取消成功', 'success')
            this.refreshData()
          } catch (error) {
            console.error('取消预约失败:', error)
            showToast('取消失败，请重试')
          }
        })
        .catch(() => {
          // 用户取消，不做任何操作
        })
    },
    
    // 签到
    checkIn(e: any) {
      const { bookingId, courseName } = e.currentTarget.dataset
      
      showModal(`确认签到「${courseName}」吗？`, '课程签到')
        .then(async () => {
          try {
            // 调用签到接口
            await bookingApi.checkIn(bookingId)
            
            showToast('签到成功', 'success')
            this.refreshData()
          } catch (error) {
            console.error('签到失败:', error)
            showToast('签到失败，请重试')
          }
        })
        .catch(() => {
          // 用户取消，不做任何操作
        })
    },
    
    // 再次预约
    rebook(e: any) {
      const { courseId } = e.currentTarget.dataset
      
      wx.navigateTo({
        url: `/pages/course/detail?courseId=${courseId}`
      })
    },
    
    // 评价课程
    evaluate(e: any) {
      const { bookingId } = e.currentTarget.dataset
      
      showToast('评价功能开发中')
    },
    
    // 格式化课程时间
    formatCourseTime(date: string, startTime: string, endTime: string) {
      const courseDate = new Date(`${date} ${startTime}`)
      
      if (isToday(courseDate)) {
        return `今天 ${startTime}-${endTime}`
      } else if (isTomorrow(courseDate)) {
        return `明天 ${startTime}-${endTime}`
      } else {
        const dateStr = date.split('-').slice(1).join('-')
        return `${dateStr} ${startTime}-${endTime}`
      }
    },
    
    // 获取状态文本
    getStatusText(status: string) {
      const statusMap: { [key: string]: string } = {
        'booked': '已预约',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      
      return statusMap[status] || status
    },
    
    // 获取状态样式
    getStatusClass(status: string) {
      const classMap: { [key: string]: string } = {
        'booked': 'status-warning',
        'completed': 'status-success',
        'cancelled': 'status-default'
      }
      
      return classMap[status] || 'status-default'
    },
    
    // 检查是否可以取消
    canCancel(date: string, startTime: string) {
      const courseDateTime = new Date(`${date} ${startTime}`)
      const now = new Date()
      const diffHours = (courseDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
      
      return diffHours >= 2 // 2小时前可以取消
    },
    
    // 检查是否可以签到
    canCheckIn(date: string, startTime: string, checkedIn: boolean) {
      if (checkedIn) return false
      
      const courseDateTime = new Date(`${date} ${startTime}`)
      const now = new Date()
      const diffMinutes = (courseDateTime.getTime() - now.getTime()) / (1000 * 60)
      
      return diffMinutes <= 30 && diffMinutes >= -60 // 课程开始前30分钟到结束后1小时可以签到
    },
    
    // 跳转到课程列表
    navigateToCourseList() {
      wx.switchTab({
        url: '/pages/course/list'
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
    }
  }
})