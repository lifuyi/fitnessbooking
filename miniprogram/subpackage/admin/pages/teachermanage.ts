import { showToast, showModal } from '../../../utils/util-complete'
import { teacherManageApi, storeApi } from '../../../utils/api-complete'
import type { Teacher, Store } from '../../../utils/types'

const app = getApp<IAppOption>()

Component({
  data: {
    // 导师列表
    teachers: [] as Teacher[],
    
    // 筛选条件
    filters: {
      storeId: 'all',
      status: 'all',
      keyword: ''
    },
    
    // 筛选选项
    filterOptions: {
      stores: [] as Store[]
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
    
    // 搜索关键词
    searchKeyword: '',
    
    
  },
  
  lifetimes: {
    attached() {
      this.checkAdminLogin()
      this.loadFilterOptions()
      this.loadTeachers()
    }
  },
  
  pageLifetimes: {
    show() {
      // 页面显示时刷新数据
      this.loadTeachers()
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
        const stores = await storeApi.getStoreList()
        
        this.setData({
          'filterOptions.stores': stores
        })
      } catch (error) {
        console.error('加载筛选选项失败:', error)
      }
    },
    
    // 加载导师列表
    async loadTeachers(reset = false) {
      if (this.data.loading) return
      
      this.setData({ loading: true })
      
      try {
        const { page, limit, filters, searchKeyword } = this.data
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
        
        if (searchKeyword) {
          params.keyword = searchKeyword
        }
        
        // 请求导师列表
        const result = await teacherManageApi.getTeacherList(params)
        
        this.setData({
          teachers: reset ? result.list : [...this.data.teachers, ...result.list],
          page: currentPage + 1,
          hasMore: result.hasMore,
          loading: false
        })
      } catch (error) {
        console.error('加载导师列表失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 刷新导师列表
    refreshTeachers() {
      this.setData({
        page: 1,
        hasMore: true
      })
      this.loadTeachers(true)
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
      
      // 重新加载导师
      this.refreshTeachers()
    },
    
    // 搜索输入
    onSearchInput(e: any) {
      this.setData({
        searchKeyword: e.detail.value
      })
    },
    
    // 确认搜索
    onSearchConfirm() {
      this.refreshTeachers()
    },
    
    // 清空搜索
    onSearchClear() {
      this.setData({
        searchKeyword: ''
      })
      this.refreshTeachers()
    },
    
    // 创建导师
    createTeacher() {
      wx.navigateTo({
        url: '/subpackage/admin/pages/teacheredit'
      })
    },
    
    // 编辑导师
    editTeacher(e: any) {
      const { teacherId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/subpackage/admin/pages/teacheredit?teacherId=${teacherId}`
      })
    },
    
    // 删除导师
    async deleteTeacher(e: any) {
      const { teacherId } = e.currentTarget.dataset
      
      try {
        const confirmed = await showModal('确定要删除这个导师吗？删除后不可恢复')
        if (!confirmed) return
        
        // 调用删除接口
        await teacherManageApi.deleteTeacher(teacherId)
        
        showToast('删除成功', 'success')
        
        // 刷新导师列表
        this.refreshTeachers()
      } catch (error) {
        console.error('删除导师失败:', error)
      }
    },
    
    // 更新导师状态
    async updateTeacherStatus(e: any) {
      const { teacherId, currentStatus } = e.currentTarget.dataset
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const statusText = newStatus === 'active' ? '启用' : '禁用'
      
      try {
        const confirmed = await showModal(`确定要${statusText}这个导师吗？`)
        if (!confirmed) return
        
        // 调用更新状态接口
        await teacherManageApi.updateTeacherStatus(teacherId, newStatus)
        
        showToast(`${statusText}成功`, 'success')
        
        // 刷新导师列表
        this.refreshTeachers()
      } catch (error) {
        console.error('更新导师状态失败:', error)
      }
    },
    
    // 查看导师详情
    viewTeacherDetail(e: any) {
      const { teacherId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/subpackage/admin/pages/teacherdetail?teacherId=${teacherId}`
      })
    },
    
    // 查看导师课程
    viewTeacherCourses(e: any) {
      const { teacherId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/subpackage/admin/pages/teachercourses?teacherId=${teacherId}`
      })
    },
    
    // 获取导师状态文本
    getTeacherStatusText(status: string) {
      switch (status) {
        case 'active':
          return '启用'
        case 'inactive':
          return '禁用'
        default:
          return '未知'
      }
    },
    
    // 获取导师状态样式
    getTeacherStatusClass(status: string) {
      switch (status) {
        case 'active':
          return 'status-success'
        case 'inactive':
          return 'status-warning'
        default:
          return 'status-default'
      }
    },
    
    // 格式化舞种显示
    formatDanceTypes(danceTypes: string[]) {
      const danceTypeMap: { [key: string]: string } = {
        'jazz': '爵士舞',
        'kpop': '韩舞',
        'hiphop': '街舞',
        'waacking': 'Waacking',
        'popping': 'Popping'
      }
      
      return danceTypes.map(type => danceTypeMap[type] || type).join(' / ')
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
            'active': '启用',
            'inactive': '禁用'
          }
          return statusMap[filters.status] || '全部状态'
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
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' }
          ]
        default:
          return []
      }
    },
    
    // 加载更多
    loadMore() {
      if (this.data.hasMore && !this.data.loading) {
        this.loadTeachers()
      }
    },
    
    // 语言切换事件处理
    onLanguageChange() {
      // 语言切换处理逻辑
    }
  }
})