// teacher/detail.ts
import { showToast, formatTime, isToday, isTomorrow } from '../../../utils/util'
import { teacherApi, courseApi } from '../../../utils/api'
import type { Teacher, Course } from '../../../utils/types'

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
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.loadTeacherDetail()
    }
  },
  
  methods: {
    // 加载导师详情
    async loadTeacherDetail() {
      try {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const teacherId = currentPage.options?.teacherId
        
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
          title: `${teacher.name}导师`
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
          title: '确认预约',
          content: '确认预约这节课程吗？'
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
    
    // 语言切换事件处理
    onLanguageChange() {
      this.setData({
        i18n: i18n
      })
    }
  }
})