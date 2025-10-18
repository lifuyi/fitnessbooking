// teacher/detail.ts
import { showToast, formatTime, isToday, isTomorrow } from '../../utils/util-complete'
import { teacherApi, courseApi } from '../../utils/api-complete'
import type { Teacher, Course } from '../../utils/types'

const app = getApp<IAppOption>()

Component({
  data: {
    // 导师信息
    teacher: null as Teacher | null,
    
    // 导师课程列表
    courses: [] as Course[],
    
    // 加载状态
    loading: true,
    
    // 分页信息
    page: 1,
    limit: 10,
    hasMore: true,
    
    // 国际化
    i18n: null,
    
    // 响应式翻译变量
    teacherIntroText: '',
    danceTypesText: '',
    teacherCoursesText: '',
    yearsExperienceText: '',
    classesText: '',
    ratingText: '',
    difficultyText: '',
    bookNowText: '',
    fullyBookedText: '',
    noCoursesText: '',
    loadingText: '',
    noMoreCoursesText: '',
    teacherTitleText: '',
    confirmBookingText: '',
    confirmBookingContentText: ''
  },
  
  lifetimes: {
    attached() {
      // 初始化i18n实例
      const i18nInstance = require('../../utils/i18n.js')
      
      // 初始化翻译变量
      this.updateTranslationTexts(i18nInstance)
      
      this.setData({
        i18n: i18nInstance
      })
      
      this.loadTeacherDetail()
    }
  },
  
  methods: {
    // 加载导师详情
    async loadTeacherDetail() {
      try {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const teacherId = currentPage.options && currentPage.options.teacherId
        
        if (!teacherId) {
          showToast('导师ID不存在')
          wx.navigateBack()
          return
        }
        
        this.setData({ loading: true })
        
        // 获取导师详情
        const teacher = await teacherApi.getTeacherDetail(teacherId)
        
        // 获取导师课程列表
        await this.loadTeacherCourses(teacherId, true)
        
        this.setData({
          teacher,
          loading: false
        })
        
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: `${teacher.name}${this.data.teacherTitleText}`
        })
      } catch (error) {
        console.error('加载导师详情失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 加载导师课程列表
    async loadTeacherCourses(teacherId: string, reset = false) {
      try {
        const { page, limit } = this.data
        const currentPage = reset ? 1 : page
        
        const result = await teacherApi.getTeacherCourses(teacherId, {
          page: currentPage,
          limit
        })
        
        this.setData({
          courses: reset ? result.list : [...this.data.courses, ...result.list],
          page: currentPage + 1,
          hasMore: result.hasMore
        })
      } catch (error) {
        console.error('加载导师课程失败:', error)
      }
    },
    
    // 跳转到课程详情
    navigateToCourseDetail(e: any) {
      const { courseId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/course/detail?courseId=${courseId}`
      })
    },
    
    // 预约课程
    async bookCourse(e: any) {
      const { courseId } = e.currentTarget.dataset
      
      // 检查登录状态
      if (!app.globalData.isLogin) {
        showToast('请先登录后再预约课程')
        return
      }
      
      try {
        // 确认预约
        const confirmed = await wx.showModal({
          title: this.data.confirmBookingText,
          content: this.data.confirmBookingContentText
        })
        
        if (!confirmed) return
        
        // 调用预约接口
        await courseApi.bookCourse(courseId)
        
        showToast('预约成功', 'success')
        
        // 刷新课程列表
        this.setData({
          page: 1,
          hasMore: true
        })
        this.loadTeacherCourses(this.data.teacher!.teacherId, true)
      } catch (error) {
        console.error('预约失败:', error)
      }
    },
    
    // 格式化课程时间
    formatCourseTime(course: Course) {
      const courseDate = new Date(`${course.date} ${course.startTime}`)
      
      if (isToday(courseDate)) {
        return `今天 ${course.startTime}`
      } else if (isTomorrow(courseDate)) {
        return `明天 ${course.startTime}`
      } else {
        const monthDay = course.date.split('-').slice(1).join('-')
        return `${monthDay} ${course.startTime}`
      }
    },
    
    // 获取剩余名额显示
    getRemainingText(course: Course) {
      const remaining = course.capacity - course.bookedCount
      if (remaining <= 5) {
        return `仅剩${remaining}名额`
      }
      return `${remaining}/${course.capacity}名额`
    },
    
    // 获取剩余名额样式
    getRemainingClass(course: Course) {
      const remaining = course.capacity - course.bookedCount
      return remaining <= 5 ? 'text-warning' : 'text-small'
    },
    
    // 获取擅长舞种显示
    getDanceTypesText(danceTypes: string[]) {
      return danceTypes.join('、')
    },
    
    // 获取难度星级
    getDifficultyStars(difficulty: number) {
      return Array(5).fill(0).map((_, index) => index < difficulty)
    },
    
    // 加载更多课程
    loadMore() {
      if (this.data.hasMore && !this.data.loading) {
        this.loadTeacherCourses(this.data.teacher!.teacherId)
      }
    },
    
    // 分享导师
    onShareAppMessage() {
      const { teacher } = this.data
      
      if (!teacher) return {}
      
      return {
        title: `${teacher.name}导师 - ${this.getDanceTypesText(teacher.danceTypes)}`,
        path: `/pages/teacher/detail?teacherId=${teacher.teacherId}`,
        imageUrl: teacher.avatar
      }
    },
    
    // 更新翻译文本
    updateTranslationTexts(i18nInstance: any) {
      this.setData({
        teacherIntroText: i18nInstance.t('teacher.introduction'),
        danceTypesText: i18nInstance.t('teacher.dance.types'),
        teacherCoursesText: i18nInstance.t('teacher.courses'),
        yearsExperienceText: i18nInstance.t('teacher.years.experience'),
        classesText: i18nInstance.t('teacher.classes'),
        ratingText: i18nInstance.t('teacher.rating'),
        difficultyText: i18nInstance.t('course.difficulty'),
        bookNowText: i18nInstance.t('course.book.now'),
        fullyBookedText: i18nInstance.t('course.fully.booked'),
        noCoursesText: i18nInstance.t('teacher.no.courses'),
        loadingText: i18nInstance.t('text.loading'),
        noMoreCoursesText: i18nInstance.t('teacher.no.more.courses'),
        teacherTitleText: i18nInstance.t('teacher.title'),
        confirmBookingText: i18nInstance.t('booking.confirm'),
        confirmBookingContentText: i18nInstance.t('booking.confirm.content')
      })
    },
    
    // 语言切换事件处理
    onLanguageChange() {
      // 重新获取最新的i18n实例
      const i18nInstance = require('../../utils/i18n.js')
      
      // 更新翻译文本
      this.updateTranslationTexts(i18nInstance)
      
      // 更新页面的i18n实例
      this.setData({
        i18n: i18nInstance
      })
      
      // 重新加载数据以更新显示
      if (this.data.teacher) {
        this.loadTeacherDetail()
      }
    }
  }
})