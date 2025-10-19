// booking/index.ts
import { checkLogin, showToast, showModal } from '../../utils/util-complete'
import { courseApi } from '../../utils/api-complete'
const i18n = require('../../utils/i18n.js')
import type { Booking, Course } from '../../utils/types'

const app = getApp<IAppOption>()

Page({
  data: {
    // 课程列表
    courses: [] as Course[],
    
    // 筛选条件
    currentType: 'regular', // regular, private, intensive
    currentDate: '',
    
    // 日期选项
    dateOptions: [] as any[],
    
    // 加载状态
    loading: false,
    
    // 国际化
    i18n: null,
    
    // 翻译文本
    switchStoreText: '',
    entranceCodeText: '',
    bookingText: '',
    regularCourseText: '',
    privateCourseText: '',
    intensiveCourseText: '',
    bookText: '',
    fullyBookedText: '',
    tenseText: '',
    bookingOpenText: '',
    loadingText: '',
    noCoursesText: '',
    viewAllCoursesText: ''
  },
  
  onLoad() {
    // 直接导入i18n实例
    const i18nInstance = require('../../utils/i18n.js')
    
    // 根据当前语言设置文本
    this.updatePageTexts(i18nInstance)
    
    this.setData({ 
      i18n: i18nInstance
    })
    
    this.checkUserLogin()
    this.initDateOptions()
    this.loadCourses()
  },

  onShow() {
    // 页面显示时刷新数据和语言设置
    const i18nInstance = require('../../utils/i18n.js')
    
    // 根据当前语言设置文本
    this.updatePageTexts(i18nInstance)
    
    this.setData({ 
      i18n: i18nInstance
    })
    
    this.loadCourses()
  },
  
  // Page methods (no 'methods' wrapper needed for Pages)
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
  
  // 根据语言更新页面文本
  updatePageTexts(i18nInstance: any) {
    const isEnglish = i18nInstance.getLanguage() === 'en'
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: isEnglish ? 'Booking' : '预约'
    })
    
    // 更新页面文本
    this.setData({
      switchStoreText: isEnglish ? 'Switch Store' : '切换门店',
      entranceCodeText: isEnglish ? 'Entrance Code' : '入场码',
      bookingText: isEnglish ? 'Booking' : '预约',
      regularCourseText: isEnglish ? 'Regular' : '常规课',
      privateCourseText: isEnglish ? 'Private' : '私教课',
      intensiveCourseText: isEnglish ? 'Intensive' : '集训课',
      bookText: isEnglish ? 'Book' : '预约',
      fullyBookedText: isEnglish ? 'Fully Booked' : '已满员',
      tenseText: isEnglish ? 'Tense' : '紧张',
      bookingOpenText: isEnglish ? 'Booking opens at ' : '开始预约',
      loadingText: isEnglish ? 'Loading...' : '加载中...',
      noCoursesText: isEnglish ? 'No courses available' : '暂无课程',
      viewAllCoursesText: isEnglish ? 'View All Courses' : '查看全部课程'
    })
  },
  
  // 初始化日期选项
  initDateOptions() {
    const today = new Date()
    const dateOptions = []
    const i18nInstance = require('../../utils/i18n.js')
    const isEnglish = i18nInstance.getLanguage() === 'en'
    
    // 生成未来5天的日期选项
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const weekDaysCN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekDaysEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const weekDays = isEnglish ? weekDaysEN : weekDaysCN
      const weekDay = weekDays[date.getDay()]
      const day = date.getDate()
      const month = date.getMonth() + 1
      
      let label = weekDay
      if (i === 0) {
        label = isEnglish ? 'Today' : '今天'
      } else if (i === 1) {
        label = isEnglish ? 'Tomorrow' : '明天'
      }
      
      dateOptions.push({
        date: this.formatDate(date),
        week: label,
        day: day,
        month: isEnglish ? this.getMonthNameEN(month) : month + '月'
      })
    }
    
    // 设置默认选中今天
    if (dateOptions.length > 0) {
      this.setData({
        currentDate: dateOptions[0].date,
        dateOptions: dateOptions
      })
    }
  },
  
  // 获取英文字份名称
  getMonthNameEN(month: number) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months[month - 1]
  },
  
  // 格式化日期
  formatDate(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },
  
  // 加载课程列表
  async loadCourses() {
    try {
      this.setData({ loading: true })
      
      const { currentDate, currentType } = this.data
      
      // 模拟API调用 - 根据日期和类型筛选课程
      const allCourses = [
        {
          courseId: 'c1',
          courseName: 'HIPHOP–常规',
          danceTypeName: 'HIPHOP',
          courseLevel: '常规',
          teacherName: 'YIYI',
          teacherAvatar: '/images/joy.jpg',
          startTime: '14:30',
          endTime: '16:00',
          capacity: 15,
          bookedCount: 11,
          canBook: true,
          isFull: false,
          isTense: false, // 将通过计算得出
          bookingOpenTime: '',
          courseType: 'regular',
          date: this.formatDate(new Date())
        },
        {
          courseId: 'c2',
          courseName: '零基础MINI班–JAZZ',
          danceTypeName: 'JAZZ',
          courseLevel: '零基础',
          teacherName: 'BOA',
          teacherAvatar: '/images/joy.jpg',
          startTime: '14:30',
          endTime: '16:00',
          capacity: 8,
          bookedCount: 0,
          canBook: false,
          isFull: false,
          isTense: false,
          bookingOpenTime: '10/18 22:00',
          courseType: 'regular',
          date: this.formatDate(new Date())
        },
        {
          courseId: 'c3',
          courseName: 'JAZZ/KPOP–进阶',
          danceTypeName: 'JAZZ/KPOP',
          courseLevel: '进阶',
          teacherName: 'LISA',
          teacherAvatar: '/images/joy.jpg',
          startTime: '14:30',
          endTime: '16:00',
          capacity: 30,
          bookedCount: 25, // 修改为25，约83%满足紧张状态条件
          canBook: true,
          isFull: false,
          isTense: false, // 将通过计算得出
          bookingOpenTime: '',
          courseType: 'regular',
          date: this.formatDate(new Date())
        },
        {
          courseId: 'c4',
          courseName: 'KPOP–常规',
          danceTypeName: 'KPOP',
          courseLevel: '常规',
          teacherName: 'QURY',
          teacherAvatar: '/images/joy.jpg',
          startTime: '16:00',
          endTime: '17:30',
          capacity: 15,
          bookedCount: 7,
          canBook: true,
          isFull: false,
          isTense: false,
          bookingOpenTime: '',
          courseType: 'regular',
          date: this.formatDate(new Date())
        },
        {
          courseId: 'c5',
          courseName: 'JAZZ–常规',
          danceTypeName: 'JAZZ',
          courseLevel: '常规',
          teacherName: 'MIKE',
          teacherAvatar: '/images/joy.jpg',
          startTime: '16:00',
          endTime: '17:30',
          capacity: 12,
          bookedCount: 12,
          canBook: false,
          isFull: true,
          isTense: false,
          bookingOpenTime: '',
          courseType: 'regular',
          date: this.formatDate(new Date())
        }
      ]
      
      // 计算课程状态（已满和紧张）
      const processedCourses = allCourses.map(course => {
        // 计算预约比例
        const bookingRatio = course.bookedCount / course.capacity
        
        // 更新课程状态
        return {
          ...course,
          isFull: course.bookedCount >= course.capacity,
          isTense: bookingRatio >= 0.8 && !course.isFull, // 预约数达到80%且未满时为紧张状态
          canBook: course.bookedCount < course.capacity && course.canBook // 只有未满且原状态可预约才可预约
        }
      })
      
      // 根据当前选择的日期和类型筛选课程
      const filteredCourses = processedCourses.filter(course => {
        const dateMatch = !currentDate || course.date === currentDate
        const typeMatch = !currentType || course.courseType === currentType
        return dateMatch && typeMatch
      })
      
      this.setData({
        courses: filteredCourses,
        loading: false
      })
    } catch (error) {
      console.error('加载课程列表失败:', error)
      showToast('加载失败，请重试')
      this.setData({ loading: false })
    }
  },
  
  // 切换课程类型
  switchCourseType(e: any) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type
    })
    this.loadCourses()
  },
  
  // 选择日期
  selectDate(e: any) {
    const date = e.currentTarget.dataset.date
    this.setData({
      currentDate: date
    })
    this.loadCourses()
  },
  
  // 预约课程
  async bookCourse(e: any) {
    const { courseId } = e.currentTarget.dataset
    
    // 检查登录状态
    if (!checkLogin()) {
      const confirmed = await showModal('请先登录后再预约课程，是否立即登录？')
      if (confirmed) {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
      return
    }
    
    try {
      // 调用预约API
      await courseApi.bookCourse(courseId)
      showToast('预约成功', 'success')
      
      // 刷新课程列表
      this.loadCourses()
    } catch (error) {
      console.error('预约失败:', error)
      showToast('预约失败，请重试')
    }
  },
  
  // 切换门店
  switchStore() {
    showToast('切换门店功能开发中')
  },
  
  // 显示入场码
  showQRCode() {
    if (!checkLogin()) {
      showToast('请先登录')
      return
    }
    
    wx.navigateTo({
      url: '/pages/qrcode/index'
    })
  },
  
  
  // 跳转到课程列表
  navigateToCourseList() {
    wx.switchTab({
      url: '/pages/course/list'
    })
  },
  
  // 语言切换事件处理
  onLanguageChange() {
    // 使用全局app实例
    const app = getApp<IAppOption>()
    const i18nInstance = app.globalData.i18n
    
    // 更新页面的i18n实例和文本
    this.setData({
      i18n: i18nInstance
    })
    
    // 更新页面文本
    this.updatePageTexts(i18nInstance)
    
    // 更新日期选项
    this.initDateOptions()
  }
})