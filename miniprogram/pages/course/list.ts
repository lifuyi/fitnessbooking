// course/list.ts
import { showToast, formatTime, isToday, isTomorrow, showModal } from '../../utils/util-complete'
import { courseApi, storeApi } from '../../utils/api-complete'
const i18n = require('../../utils/i18n.js')
import type { Course, Store, DanceType } from '../../utils/types'

const app = getApp<IAppOption>()

Component({
  data: {
    // 筛选条件
    filters: {
      date: 'all', // all, today, tomorrow, this_week
      danceType: 'all',
      teacherId: 'all',
      storeId: 'all'
    },
    
    // 筛选选项
    filterOptions: {
      dates: [
        { label: i18n.t('filter.all'), value: 'all' },
        { label: i18n.t('filter.today'), value: 'today' },
        { label: i18n.t('filter.tomorrow'), value: 'tomorrow' },
        { label: i18n.t('filter.this.week'), value: 'this_week' }
      ],
      danceTypes: [] as DanceType[],
      teachers: [] as any[],
      stores: [] as Store[]
    },
    
    // 国际化
    i18n: i18n,
    
    // 课程列表
    courses: [] as Course[],
    
    // 分页信息
    page: 1,
    limit: 10,
    hasMore: true,
    loading: false,
    
    // 显示筛选器
    showFilter: false,
    
    // 当前显示的筛选器
    currentFilter: 'date'
  },
  
  lifetimes: {
    attached() {
      this.loadFilterOptions()
      this.loadCourses()
    }
  },
  
  pageLifetimes: {
    show() {
      // 页面显示时刷新数据
      this.refreshCourses()
    }
  },
  
  methods: {
    // 加载筛选选项
    async loadFilterOptions() {
      try {
        // 加载门店列表
        const stores = await storeApi.getStoreList()
        
        // 模拟舞种数据
        const danceTypes = [
          { id: 'jazz', name: '爵士舞', description: '', icon: '', color: '#FF6B35', status: 'active', sort: 1 },
          { id: 'kpop', name: '韩舞', description: '', icon: '', color: '#34C759', status: 'active', sort: 2 },
          { id: 'hiphop', name: '街舞', description: '', icon: '', color: '#007AFF', status: 'active', sort: 3 },
          { id: 'waacking', name: 'Waacking', description: '', icon: '', color: '#AF52DE', status: 'active', sort: 4 },
          { id: 'popping', name: 'Popping', description: '', icon: '', color: '#FF9500', status: 'active', sort: 5 }
        ]
        
        // 模拟导师数据
        const teachers = [
          { teacherId: 't1', name: 'BOA', avatar: 'https://picsum.photos/seed/boa/100/100.jpg' },
          { teacherId: 't2', name: 'QURY', avatar: 'https://picsum.photos/seed/qury/100/100.jpg' },
          { teacherId: 't3', name: 'LISA', avatar: 'https://picsum.photos/seed/lisa/100/100.jpg' }
        ]
        
        this.setData({
          'filterOptions.stores': stores,
          'filterOptions.danceTypes': danceTypes,
          'filterOptions.teachers': teachers
        })
      } catch (error) {
        console.error('加载筛选选项失败:', error)
      }
    },
    
    // 加载课程列表
    async loadCourses(reset = false) {
      if (this.data.loading) return
      
      this.setData({ loading: true })
      
      try {
        const { page, limit, filters } = this.data
        const currentPage = reset ? 1 : page
        
        // 构建查询参数
        const params: any = {
          page: currentPage,
          limit
        }
        
        // 添加筛选条件
        if (filters.date !== 'all') {
          params.date = this.getDateByFilter(filters.date)
        }
        
        if (filters.danceType !== 'all') {
          params.danceType = filters.danceType
        }
        
        if (filters.teacherId !== 'all') {
          params.teacherId = filters.teacherId
        }
        
        if (filters.storeId !== 'all') {
          params.storeId = filters.storeId
        }
        
        // 请求课程列表
        const result = await courseApi.getCourseList(params)
        
        this.setData({
          courses: reset ? result.list : [...this.data.courses, ...result.list],
          page: currentPage + 1,
          hasMore: result.hasMore,
          loading: false
        })
      } catch (error) {
        console.error('加载课程列表失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 根据筛选条件获取日期
    getDateByFilter(filter: string): string {
      const today = new Date()
      
      switch (filter) {
        case 'today':
          return formatTime(today, 'YYYY-MM-DD')
        case 'tomorrow':
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          return formatTime(tomorrow, 'YYYY-MM-DD')
        case 'this_week':
          // 返回本周第一天
          const firstDay = new Date(today)
          firstDay.setDate(today.getDate() - today.getDay())
          return formatTime(firstDay, 'YYYY-MM-DD')
        default:
          return ''
      }
    },
    
    // 刷新课程列表
    refreshCourses() {
      this.setData({
        page: 1,
        hasMore: true
      })
      this.loadCourses(true)
    },
    
    // 显示筛选器
    showFilterPanel(e: any) {
      const { type } = e.currentTarget.dataset
      this.setData({
        showFilter: true,
        currentFilter: type
      })
    },
    
    // 隐藏筛选器
    hideFilterPanel() {
      this.setData({
        showFilter: false
      })
    },
    
    // 选择筛选条件
    selectFilterOption(e: any) {
      const { value } = e.currentTarget.dataset
      const { currentFilter } = this.data
      
      this.setData({
        [`filters.${currentFilter}`]: value,
        showFilter: false
      })
      
      // 重新加载课程
      this.refreshCourses()
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
        showModal('请先登录后再预约课程')
        return
      }
      
      try {
        // 确认预约
        const confirmed = await showModal('确认预约这节课程吗？')
        if (!confirmed) return
        
        // 调用预约接口
        await courseApi.bookCourse(courseId)
        
        showToast('预约成功', 'success')
        
        // 刷新课程列表
        this.refreshCourses()
      } catch (error) {
        console.error('预约失败:', error)
      }
    },
    
    // 格式化课程时间
    formatCourseTime(course: Course) {
      const courseDate = new Date(`${course.date} ${course.startTime}`)
      
      if (isToday(courseDate)) {
        return `今天 ${course.startTime}-${course.endTime}`
      } else if (isTomorrow(courseDate)) {
        return `明天 ${course.startTime}-${course.endTime}`
      } else {
        const monthDay = course.date.split('-').slice(1).join('-')
        return `${monthDay} ${course.startTime}-${course.endTime}`
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
    
    // 获取筛选条件显示文本
    getFilterDisplayText(type: string) {
      const { filters, filterOptions } = this.data
      
      switch (type) {
        case 'date':
          const dateOption = filterOptions.dates.find(item => item.value === filters.date)
          return dateOption ? dateOption.label : '全部'
        case 'danceType':
          if (filters.danceType === 'all') return '舞种'
          const danceOption = filterOptions.danceTypes.find(item => item.id === filters.danceType)
          return danceOption ? danceOption.name : '舞种'
        case 'teacherId':
          if (filters.teacherId === 'all') return '导师'
          const teacherOption = filterOptions.teachers.find(item => item.teacherId === filters.teacherId)
          return teacherOption ? teacherOption.name : '导师'
        case 'storeId':
          if (filters.storeId === 'all') return '门店'
          const storeOption = filterOptions.stores.find(item => item.storeId === filters.storeId)
          return storeOption ? storeOption.name : '门店'
        default:
          return '全部'
      }
    },
    
    // 获取筛选选项列表
    getFilterOptions(type: string) {
      const { filterOptions } = this.data
      
      switch (type) {
        case 'date':
          return filterOptions.dates
        case 'danceType':
          return filterOptions.danceTypes.map(item => ({ label: item.name, value: item.id }))
        case 'teacherId':
          return filterOptions.teachers.map(item => ({ label: item.name, value: item.teacherId }))
        case 'storeId':
          return filterOptions.stores.map(item => ({ label: item.name, value: item.storeId }))
        default:
          return []
      }
    },
    
    // 加载更多
    loadMore() {
      if (this.data.hasMore && !this.data.loading) {
        this.loadCourses()
      }
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
      this.loadCourses()
    }
  }
})