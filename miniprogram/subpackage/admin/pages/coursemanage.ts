// admin/coursemanage.ts
import { showToast, showModal, formatTime } from '../../../utils/util-complete'
import { adminApi, storeApi, teacherApi } from '../../../utils/api-complete'
import type { Course, Store, Teacher } from '../../../utils/types'
const i18n = require('../../../utils/i18n.js')

const app = getApp<IAppOption>()

Component({
  data: {
    // 课程列表
    courses: [] as Course[],
    
    // 筛选条件
    filters: {
      storeId: 'all',
      status: 'all',
      date: ''
    },
    
    // 筛选选项
    filterOptions: {
      stores: [] as Store[],
      teachers: [] as Teacher[]
    },
    
    // 分页信息
    page: 1,
    limit: 10,
    hasMore: true,
    
    // 加载状态
    loading: false,
    
    // 显示筛选器
    showFilter: false,
    
    // 当前显示的筛选器
    currentFilter: 'storeId',
    
    // 待办提醒
    todoCount: 0,
    
    // 日期选择器显示
    showDatePicker: false,
    currentDate: '',
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.checkAdminLogin()
      this.loadFilterOptions()
      this.loadCourses()
      this.loadTodoCount()
    }
  },
  
  pageLifetimes: {
    show() {
      // 页面显示时刷新数据
      this.loadCourses()
      this.loadTodoCount()
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
    
    // 加载筛选选项
    async loadFilterOptions() {
      try {
        const [stores, teachers] = await Promise.all([
          storeApi.getStoreList(),
          teacherApi.getTeacherList()
        ])
        
        this.setData({
          'filterOptions.stores': stores,
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
        if (filters.storeId !== 'all') {
          params.storeId = filters.storeId
        }
        
        if (filters.status !== 'all') {
          params.status = filters.status
        }
        
        if (filters.date) {
          params.date = filters.date
        }
        
        // 请求课程列表
        const result = await adminApi.getCourseList(params)
        
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
    
    // 加载待办数量
    async loadTodoCount() {
      try {
        // 模拟API调用
        const todoCount = 3 // 今日待开始课程数量
        this.setData({ todoCount })
      } catch (error) {
        console.error('加载待办数量失败:', error)
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
    
    // 显示日期选择器
    showDatePicker() {
      this.setData({
        showDatePicker: true,
        currentDate: this.data.filters.date || formatTime(new Date(), 'YYYY-MM-DD')
      })
    },
    
    // 隐藏日期选择器
    hideDatePicker() {
      this.setData({
        showDatePicker: false
      })
    },
    
    // 确认日期选择
    onDateConfirm(e: any) {
      const date = e.detail.value
      this.setData({
        'filters.date': date,
        showDatePicker: false
      })
      
      // 重新加载课程
      this.refreshCourses()
    },
    
    // 创建课程
    createCourse() {
      wx.navigateTo({
        url: '/subpackage/admin/pages/courseedit'
      })
    },
    
    // 编辑课程
    editCourse(e: any) {
      const { courseId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/subpackage/admin/pages/courseedit?courseId=${courseId}`
      })
    },
    
    // 删除课程
    async deleteCourse(e: any) {
      const { courseId } = e.currentTarget.dataset
      
      try {
        const confirmed = await showModal('确定要删除这个课程吗？删除后不可恢复')
        if (!confirmed) return
        
        // 调用删除接口
        await adminApi.deleteCourse(courseId)
        
        showToast('删除成功', 'success')
        
        // 刷新课程列表
        this.refreshCourses()
      } catch (error) {
        console.error('删除课程失败:', error)
      }
    },
    
    // 下架课程
    async cancelCourse(e: any) {
      const { courseId } = e.currentTarget.dataset
      
      try {
        const confirmed = await showModal('确定要下架这个课程吗？')
        if (!confirmed) return
        
        // 调用下架接口
        await adminApi.updateCourse(courseId, { status: 'cancelled' })
        
        showToast('下架成功', 'success')
        
        // 刷新课程列表
        this.refreshCourses()
      } catch (error) {
        console.error('下架课程失败:', error)
      }
    },
    
    // 查看课程预约情况
    viewCourseBookings(e: any) {
      const { courseId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/subpackage/admin/pages/coursebookings?courseId=${courseId}`
      })
    },
    
    // 格式化课程时间
    formatCourseTime(course: Course) {
      return `${course.date} ${course.startTime}-${course.endTime}`
    },
    
    // 获取课程状态文本
    getCourseStatusText(status: string) {
      switch (status) {
        case 'active':
          return '进行中'
        case 'cancelled':
          return '已取消'
        case 'completed':
          return '已完成'
        default:
          return '未知'
      }
    },
    
    // 获取课程状态样式
    getCourseStatusClass(status: string) {
      switch (status) {
        case 'active':
          return 'status-primary'
        case 'cancelled':
          return 'status-warning'
        case 'completed':
          return 'status-success'
        default:
          return 'status-default'
      }
    },
    
    // 获取筛选条件显示文本
    getFilterDisplayText(type: string) {
      const { filters, filterOptions } = this.data
      
      switch (type) {
        case 'storeId':
          if (filters.storeId === 'all') return '全部门店'
          const storeOption = filterOptions.stores.find(item => item.storeId === filters.storeId)
          return storeOption ? storeOption.name : '全部门店'
        case 'status':
          if (filters.status === 'all') return '全部状态'
          const statusMap: { [key: string]: string } = {
            'active': '进行中',
            'cancelled': '已取消',
            'completed': '已完成'
          }
          return statusMap[filters.status] || '全部状态'
        case 'date':
          return filters.date || '选择日期'
        default:
          return '全部'
      }
    },
    
    // 获取筛选选项列表
    getFilterOptions(type: string) {
      const { filterOptions } = this.data
      
      switch (type) {
        case 'storeId':
          return [{ label: '全部门店', value: 'all' }, ...filterOptions.stores.map(item => ({ label: item.name, value: item.storeId }))]
        case 'status':
          return [
            { label: '全部状态', value: 'all' },
            { label: '进行中', value: 'active' },
            { label: '已取消', value: 'cancelled' },
            { label: '已完成', value: 'completed' }
          ]
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
    
    // 语言切换事件处理
    onLanguageChange() {
      this.setData({
        i18n: i18n
      })
    }
  }
})