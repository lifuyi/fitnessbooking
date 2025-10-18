// admin/studentmanage.ts
import { showToast, showModal, formatTime } from '../../../utils/util-complete'
import { adminApi } from '../../../utils/api-complete'
import type { UserInfo } from '../../../utils/types'
const i18n = require('../../../utils/i18n.js')
const app = getApp<IAppOption>()

Component({
  data: {
    // 学员列表
    students: [] as UserInfo[],
    
    // 搜索关键词
    keyword: '',
    
    // 分页信息
    page: 1,
    limit: 10,
    hasMore: true,
    
    // 加载状态
    loading: false,
    
    // 显示学员详情
    showStudentDetail: false,
    
    // 当前学员
    currentStudent: null as UserInfo | null,
    
    // 课程次数调整
    showClassesModal: false,
    classesData: {
      danceType: '',
      count: 0,
      reason: ''
    },
    
    // 舞种选项
    danceTypes: [
      { id: 'jazz', name: '爵士舞' },
      { id: 'kpop', name: '韩舞' },
      { id: 'hiphop', name: '街舞' },
      { id: 'waacking', name: 'Waacking' },
      { id: 'popping', name: 'Popping' }
    ],
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.checkAdminLogin()
      this.loadStudents()
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
    
    // 加载学员列表
    async loadStudents(reset = false) {
      if (this.data.loading) return
      
      this.setData({ loading: true })
      
      try {
        const { page, limit, keyword } = this.data
        const currentPage = reset ? 1 : page
        
        // 构建查询参数
        const params: any = {
          page: currentPage,
          limit
        }
        
        if (keyword) {
          params.keyword = keyword
        }
        
        // 请求学员列表
        const result = await adminApi.getStudentList(params)
        
        this.setData({
          students: reset ? result.list : [...this.data.students, ...result.list],
          page: currentPage + 1,
          hasMore: result.hasMore,
          loading: false
        })
      } catch (error) {
        console.error('加载学员列表失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 搜索输入
    onSearchInput(e: any) {
      const keyword = e.detail.value
      this.setData({ keyword })
    },
    
    // 搜索确认
    onSearchConfirm() {
      this.setData({
        page: 1,
        hasMore: true
      })
      this.loadStudents(true)
    },
    
    // 查看学员详情
    viewStudentDetail(e: any) {
      const { student } = e.currentTarget.dataset
      this.setData({
        currentStudent: student,
        showStudentDetail: true
      })
    },
    
    // 隐藏学员详情
    hideStudentDetail() {
      this.setData({
        showStudentDetail: false,
        currentStudent: null
      })
    },
    
    // 显示课程次数调整弹窗
    showClassesModal(e: any) {
      const { student } = e.currentTarget.dataset
      this.setData({
        currentStudent: student,
        showClassesModal: true,
        classesData: {
          danceType: '',
          count: 0,
          reason: ''
        }
      })
    },
    
    // 隐藏课程次数调整弹窗
    hideClassesModal() {
      this.setData({
        showClassesModal: false,
        currentStudent: null,
        classesData: {
          danceType: '',
          count: 0,
          reason: ''
        }
      })
    },
    
    // 舞种选择
    onDanceTypeChange(e: any) {
      const danceType = this.data.danceTypes[e.detail.value].id
      this.setData({
        'classesData.danceType': danceType
      })
    },
    
    // 次数输入
    onCountInput(e: any) {
      const count = parseInt(e.detail.value) || 0
      this.setData({
        'classesData.count': count
      })
    },
    
    // 原因输入
    onReasonInput(e: any) {
      const reason = e.detail.value
      this.setData({
        'classesData.reason': reason
      })
    },
    
    // 确认调整课程次数
    async confirmClassesUpdate() {
      const { currentStudent, classesData } = this.data
      
      if (!currentStudent) return
      
      // 表单验证
      if (!classesData.danceType) {
        showToast('请选择舞种')
        return
      }
      
      if (classesData.count === 0) {
        showToast('请输入调整次数')
        return
      }
      
      if (!classesData.reason) {
        showToast('请输入调整原因')
        return
      }
      
      try {
        // 调用调整接口
        await adminApi.updateStudentClasses(currentStudent.userId, classesData)
        
        showToast('调整成功', 'success')
        
        // 刷新学员列表
        this.loadStudents(true)
        
        // 关闭弹窗
        this.hideClassesModal()
      } catch (error) {
        console.error('调整课程次数失败:', error)
      }
    },
    
    // 查看学员预约记录
    viewStudentBookings(e: any) {
      const { userId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/subpackage/admin/pages/studentbookings?userId=${userId}`
      })
    },
    
    // 格式化注册时间
    formatRegisterTime(time: string) {
      return formatTime(new Date(time), 'YYYY-MM-DD')
    },
    
    // 获取舞种名称
    getDanceTypeName(danceTypeId: string) {
      const danceType = this.data.danceTypes.find(item => item.id === danceTypeId)
      return danceType ? danceType.name : danceTypeId
    },
    
    // 获取学员剩余课程次数
    getStudentClasses(student: UserInfo) {
      if (!student.remainingClasses) return []
      
      return Object.entries(student.remainingClasses).map(([danceType, count]) => ({
        danceType,
        count,
        name: this.getDanceTypeName(danceType)
      }))
    },
    
    // 加载更多
    loadMore() {
      if (this.data.hasMore && !this.data.loading) {
        this.loadStudents()
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