// course/detail.ts
import { showToast, showModal, formatTime, isToday, isTomorrow } from '../../utils/util-complete'
import { courseApi, teacherApi } from '../../utils/api-complete'
const i18n = require('../../utils/i18n.js')
import type { Course, Teacher } from '../../utils/types'

const app = getApp<IAppOption>()

Component({
  data: {
    // 课程信息
    course: null as Course | null,
    
    // 导师信息
    teacher: null as Teacher | null,
    
    // 加载状态
    loading: true,
    
    // 预约状态
    bookingStatus: 'available' as 'available' | 'booked' | 'full' | 'expired',
    
    // 用户剩余课程次数
    remainingClasses: 0,
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.loadCourseDetail()
    }
  },
  
  methods: {
    // 加载课程详情
    async loadCourseDetail() {
      try {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const courseId = currentPage.options?.courseId
        
        if (!courseId) {
          showToast('课程ID不存在')
          wx.navigateBack()
          return
        }
        
        this.setData({ loading: true })
        
        // 获取课程详情
        const course = await courseApi.getCourseDetail(courseId)
        
        // 获取导师信息
        const teacher = await teacherApi.getTeacherDetail(course.teacherId)
        
        // 检查预约状态
        const bookingStatus = this.checkBookingStatus(course)
        
        // 获取用户剩余课程次数
        const remainingClasses = this.getUserRemainingClasses(course.danceType)
        
        this.setData({
          course,
          teacher,
          bookingStatus,
          remainingClasses,
          loading: false
        })
        
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: course.name
        })
      } catch (error) {
        console.error('加载课程详情失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 检查预约状态
    checkBookingStatus(course: Course): 'available' | 'booked' | 'full' | 'expired' {
      // 检查课程是否已过期
      const courseDateTime = new Date(`${course.date} ${course.startTime}`)
      const now = new Date()
      
      if (courseDateTime < now) {
        return 'expired'
      }
      
      // 检查是否已满员
      if (course.bookedCount >= course.capacity) {
        return 'full'
      }
      
      // 检查是否已预约（这里需要根据实际业务逻辑检查）
      // 暂时返回可预约状态
      return 'available'
    },
    
    // 获取用户剩余课程次数
    getUserRemainingClasses(danceType: string): number {
      if (!app.globalData.isLogin) {
        return 0
      }
      
      const userInfo = app.globalData.userInfo
      return userInfo?.remainingClasses?.[danceType] || 0
    },
    
    // 预约课程
    async bookCourse() {
      // 检查登录状态
      if (!app.globalData.isLogin) {
        const confirmed = await showModal('请先登录后再预约课程，是否立即登录？')
        if (confirmed) {
          // 跳转到登录页面或触发登录
          try {
            await app.wxLogin()
            // 重新检查预约状态
            this.loadCourseDetail()
          } catch (error) {
            console.error('登录失败:', error)
          }
        }
        return
      }
      
      const { course, bookingStatus, remainingClasses } = this.data
      
      if (!course) return
      
      // 检查预约状态
      if (bookingStatus === 'expired') {
        showToast('课程已过期')
        return
      }
      
      if (bookingStatus === 'full') {
        showToast('课程已满员')
        return
      }
      
      if (bookingStatus === 'booked') {
        showToast('您已预约此课程')
        return
      }
      
      // 检查课程次数
      if (course.consumeType === 'class_card' && remainingClasses <= 0) {
        showModal('您的课程次数不足，请线下购卡或联系客服')
        return
      }
      
      try {
        // 确认预约
        const confirmText = course.consumeType === 'free' 
          ? '确认预约此免费体验课程吗？' 
          : `确认预约此课程吗？将消耗1次${course.danceTypeName}课程次数（剩余${remainingClasses}次）`
        
        const confirmed = await showModal(confirmText)
        if (!confirmed) return
        
        // 调用预约接口
        await courseApi.bookCourse(course.courseId)
        
        showToast('预约成功', 'success')
        
        // 更新预约状态
        this.setData({ bookingStatus: 'booked' })
        
        // 更新课程预约人数
        this.setData({
          'course.bookedCount': course.bookedCount + 1
        })
        
        // 更新用户剩余次数
        if (course.consumeType === 'class_card') {
          this.setData({ remainingClasses: remainingClasses - 1 })
        }
      } catch (error) {
        console.error('预约失败:', error)
        showToast('预约失败，请重试')
      }
    },
    
    // 分享课程
    onShareAppMessage() {
      const { course } = this.data
      
      if (!course) return {}
      
      return {
        title: course.name,
        path: `/pages/course/detail?courseId=${course.courseId}`,
        imageUrl: course.coverImage
      }
    },
    
    // 跳转到导师详情
    navigateToTeacherDetail() {
      const { teacher } = this.data
      
      if (!teacher) return
      
      wx.navigateTo({
        url: `/pages/teacher/detail?teacherId=${teacher.teacherId}`
      })
    },
    
    // 格式化课程时间
    formatCourseTime(course: Course) {
      const courseDate = new Date(`${course.date} ${course.startTime}`)
      
      if (isToday(courseDate)) {
        return `今天 ${course.startTime}-${course.endTime}`
      } else if (isTomorrow(courseDate)) {
        return `明天 ${course.startTime}-${course.endTime}`
      } else {
        const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const weekDay = weekDays[courseDate.getDay()]
        const monthDay = course.date.split('-').slice(1).join('-')
        return `${monthDay} ${weekDay} ${course.startTime}-${course.endTime}`
      }
    },
    
    // 获取消耗描述
    getConsumeText(course: Course) {
      if (course.consumeType === 'free') {
        return '免费体验'
      } else {
        return `消耗1次${course.danceTypeName}课程卡`
      }
    },
    
    // 获取预约按钮文本
    getBookingButtonText() {
      const { bookingStatus } = this.data
      
      switch (bookingStatus) {
        case 'expired':
          return '已结束'
        case 'full':
          return '已满员'
        case 'booked':
          return '已预约'
        case 'available':
          return '立即预约'
        default:
          return '立即预约'
      }
    },
    
    // 获取预约按钮样式
    getBookingButtonClass() {
      const { bookingStatus } = this.data
      
      switch (bookingStatus) {
        case 'expired':
        case 'full':
          return 'btn-disabled'
        case 'booked':
          return 'btn-success'
        case 'available':
          return 'btn-primary'
        default:
          return 'btn-primary'
      }
    },
    
    // 返回上一页
    navigateBack() {
      wx.navigateBack()
    },
    
    // 获取难度星级
    getDifficultyStars(difficulty: number) {
      return Array(5).fill(0).map((_, index) => index < difficulty)
    },
    
    // 拨打门店电话
    makePhoneCall() {
      const { course } = this.data
      
      if (!course) return
      
      // 这里需要获取门店电话，暂时使用模拟数据
      const phone = '19925187494'
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    
    // 打开地图导航
    openLocation() {
      const { course, i18n } = this.data
      
      if (!course) return
      
      // 这里需要获取门店位置信息，暂时使用模拟数据
      wx.openLocation({
        latitude: 22.5315,
        longitude: 114.0595,
        name: `${i18n.t('app.name')}（${course.storeName}）`,
        address: '南山区宝能城'
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
      this.setData({
        i18n: i18n
      })
    }
  }
})