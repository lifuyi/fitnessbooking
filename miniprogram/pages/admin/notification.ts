// admin/notification.ts
import { showToast, showModal, formatTime } from '../../utils/util-complete'
import { adminApi, courseApi } from '../../utils/api-complete'
import type { Notification, Course } from '../../utils/types'
const i18n = require('../../utils/i18n.js')
const app = getApp<IAppOption>()

Component({
  data: {
    // 通知列表
    notifications: [] as Notification[],
    
    // 课程列表（用于课程变动通知）
    courses: [] as Course[],
    
    // 当前通知类型
    currentType: 'course_change' as 'course_change' | 'class_reminder' | 'system' | 'promotion',
    
    // 显示创建通知弹窗
    showCreateModal: false,
    
    // 通知表单数据
    notificationForm: {
      title: '',
      content: '',
      type: 'course_change' as 'course_change' | 'class_reminder' | 'system' | 'promotion',
      targetType: 'all' as 'all' | 'users' | 'store' | 'course',
      targetId: '',
      sendTime: ''
    },
    
    // 选中的目标标签
    selectedTargetLabel: '',
    
    // 日期时间选择器显示
    showDateTimePicker: false,
    currentDateTime: '',
    
    // 加载状态
    loading: false,
    
    // 通知类型选项
    typeOptions: [
      { label: '课程变动', value: 'course_change' },
      { label: '上课提醒', value: 'class_reminder' },
      { label: '系统通知', value: 'system' },
      { label: '营销活动', value: 'promotion' }
    ],
    
    // 目标类型选项
    targetTypeOptions: [
      { label: '全部用户', value: 'all' },
      { label: '指定用户', value: 'users' },
      { label: '指定门店', value: 'store' },
      { label: '指定课程', value: 'course' }
    ],
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.checkAdminLogin()
      this.loadNotifications()
      this.loadCourses()
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
          url: '/pages/admin/login'
        })
        return
      }
      
      // 更新全局状态
      app.globalData.token = adminToken
      app.globalData.userInfo = adminInfo
      app.globalData.isLogin = true
      app.globalData.userRole = 'admin'
    },
    
    // 加载通知列表
    async loadNotifications() {
      try {
        this.setData({ loading: true })
        
        // 模拟API调用
        const notifications = [
          {
            notificationId: 'n1',
            title: '课程调整通知',
            content: '明天19:00的爵士舞课程调整到20:00',
            type: 'course_change',
            targetUsers: [],
            targetType: 'course',
            targetId: 'c1',
            status: 'sent',
            sendCount: 15,
            readCount: 12,
            createTime: '2023-10-18 10:00:00'
          },
          {
            notificationId: 'n2',
            title: '上课提醒',
            content: '您预约的课程将在1小时后开始',
            type: 'class_reminder',
            targetUsers: [],
            targetType: 'users',
            status: 'scheduled',
            sendCount: 0,
            readCount: 0,
            createTime: '2023-10-18 09:00:00'
          }
        ]
        
        this.setData({
          notifications,
          loading: false
        })
      } catch (error) {
        console.error('加载通知列表失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 加载课程列表
    async loadCourses() {
      try {
        // 模拟API调用
        const courses = [
          {
            courseId: 'c1',
            name: '周六爵士进阶课',
            date: '2023-10-19',
            startTime: '19:00',
            endTime: '20:30'
          },
          {
            courseId: 'c2',
            name: '韩舞基础课',
            date: '2023-10-20',
            startTime: '18:00',
            endTime: '19:30'
          }
        ]
        
        this.setData({ courses })
      } catch (error) {
        console.error('加载课程列表失败:', error)
      }
    },
    
    // 切换通知类型
    switchType(e: any) {
      const { type } = e.currentTarget.dataset
      this.setData({ currentType: type })
    },
    
    // 显示创建通知弹窗
    showCreateNotification() {
      this.setData({
        showCreateModal: true,
        selectedTargetLabel: '',
        notificationForm: {
          title: '',
          content: '',
          type: 'course_change',
          targetType: 'all',
          targetId: '',
          sendTime: ''
        }
      })
    },
    
    // 隐藏创建通知弹窗
    hideCreateModal() {
      this.setData({
        showCreateModal: false
      })
    },
    
    // 表单输入
    onFormInput(e: any) {
      const { field } = e.currentTarget.dataset
      const value = e.detail.value
      this.setData({
        [`notificationForm.${field}`]: value
      })
    },
    
    // 通知类型选择
    onTypeChange(e: any) {
      const type = this.data.typeOptions[e.detail.value].value
      this.setData({
        'notificationForm.type': type
      })
    },
    
    // 目标类型选择
    onTargetTypeChange(e: any) {
      const targetType = this.data.targetTypeOptions[e.detail.value].value
      this.setData({
        'notificationForm.targetType': targetType,
        'notificationForm.targetId': '',
        selectedTargetLabel: ''
      })
    },
    
    // 目标选择
    onTargetChange(e: any) {
      const targetId = e.detail.value
      const targetOptions = this.getTargetOptions()
      const selectedOption = targetOptions.find(item => item.value === targetId)
      
      this.setData({
        'notificationForm.targetId': targetId,
        selectedTargetLabel: selectedOption ? selectedOption.label : ''
      })
    },
    
    // 显示日期时间选择器
    showDateTimePicker() {
      const now = new Date()
      const dateTime = formatTime(now, 'YYYY-MM-DD hh:mm')
      this.setData({
        showDateTimePicker: true,
        currentDateTime: dateTime
      })
    },
    
    // 隐藏日期时间选择器
    hideDateTimePicker() {
      this.setData({
        showDateTimePicker: false
      })
    },
    
    // 日期时间确认
    onDateTimeConfirm(e: any) {
      const dateTime = e.detail.value
      this.setData({
        'notificationForm.sendTime': dateTime,
        showDateTimePicker: false
      })
    },
    
    // 发送通知
    async sendNotification() {
      const { notificationForm } = this.data
      
      // 表单验证
      if (!notificationForm.title) {
        showToast('请输入通知标题')
        return
      }
      
      if (!notificationForm.content) {
        showToast('请输入通知内容')
        return
      }
      
      if (notificationForm.targetType !== 'all' && !notificationForm.targetId) {
        showToast('请选择发送目标')
        return
      }
      
      try {
        // 调用发送通知接口
        await adminApi.sendNotification(notificationForm)
        
        showToast('发送成功', 'success')
        
        // 刷新通知列表
        this.loadNotifications()
        
        // 关闭弹窗
        this.hideCreateModal()
      } catch (error) {
        console.error('发送通知失败:', error)
      }
    },
    
    // 删除通知
    async deleteNotification(e: any) {
      const { notificationId } = e.currentTarget.dataset
      
      try {
        const confirmed = await showModal('确定要删除这个通知吗？')
        if (!confirmed) return
        
        // 调用删除接口
        // await adminApi.deleteNotification(notificationId)
        
        showToast('删除成功', 'success')
        
        // 刷新通知列表
        this.loadNotifications()
      } catch (error) {
        console.error('删除通知失败:', error)
      }
    },
    
    // 获取通知类型文本
    getNotificationTypeText(type: string) {
      const option = this.data.typeOptions.find(item => item.value === type)
      return option ? option.label : type
    },
    
    // 获取通知状态文本
    getNotificationStatusText(status: string) {
      switch (status) {
        case 'draft':
          return '草稿'
        case 'scheduled':
          return '已计划'
        case 'sent':
          return '已发送'
        case 'cancelled':
          return '已取消'
        default:
          return '未知'
      }
    },
    
    // 获取通知状态样式
    getNotificationStatusClass(status: string) {
      switch (status) {
        case 'draft':
          return 'status-default'
        case 'scheduled':
          return 'status-primary'
        case 'sent':
          return 'status-success'
        case 'cancelled':
          return 'status-warning'
        default:
          return 'status-default'
      }
    },
    
    // 格式化时间
    formatTime(time: string) {
      return formatTime(new Date(time), 'MM-DD HH:mm')
    },
    
    // 获取目标选项列表
    getTargetOptions() {
      const { targetType, courses } = this.data
      
      switch (targetType) {
        case 'course':
          return courses.map(course => ({
            label: `${course.name} (${course.date} ${course.startTime})`,
            value: course.courseId
          }))
        case 'store':
          return [
            { label: '南山店', value: 'store1' },
            { label: '福田店', value: 'store2' }
          ]
        default:
          return []
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