import { showToast } from '../../../utils/util-complete'
import { teacherManageApi, storeApi } from '../../../utils/api-complete'
import type { Store, DanceType } from '../../../utils/types'

Page({
  data: {
    // 导师信息
    teacherId: '',
    teacher: {
      name: '',
      phone: '',
      avatar: '' as string | { type: 'image', path: string },
      danceTypes: [] as string[],
      stores: [] as string[],
      introduction: '',
      experience: '',
      rating: 5,
      status: 'active'
    } as any,
    
    // 筛选选项
    filterOptions: {
      stores: [] as Store[],
      danceTypes: [] as DanceType[]
    },
    
    // 上传状态
    uploadingAvatar: false,
    
    // 提交状态
    submitting: false,
    
    // 是否编辑模式
    isEdit: false,
    
    
  },
  
  onLoad(options: any) {
    const { teacherId } = options
    
    this.setData({
      isEdit: !!teacherId,
      teacherId: teacherId || ''
    })
    
    this.loadFilterOptions()
    
    if (teacherId) {
      this.loadTeacherDetail(teacherId)
    }
  },
  
  // 加载筛选选项
  async loadFilterOptions() {
    try {
      const stores = await storeApi.getStoreList()
      
      // 模拟舞种数据
      const danceTypes = [
        { id: 'jazz', name: '爵士舞', description: '', icon: '', color: '#FF6B35', status: 'active', sort: 1 },
        { id: 'kpop', name: '韩舞', description: '', icon: '', color: '#34C759', status: 'active', sort: 2 },
        { id: 'hiphop', name: '街舞', description: '', icon: '', color: '#007AFF', status: 'active', sort: 3 },
        { id: 'waacking', name: 'Waacking', description: '', icon: '', color: '#AF52DE', status: 'active', sort: 4 },
        { id: 'popping', name: 'Popping', description: '', icon: '', color: '#FF9500', status: 'active', sort: 5 }
      ]
      
      this.setData({
        'filterOptions.stores': stores,
        'filterOptions.danceTypes': danceTypes
      })
    } catch (error) {
      console.error('加载筛选选项失败:', error)
    }
  },
  
  // 加载导师详情
  async loadTeacherDetail(teacherId: string) {
    try {
      const teacher = await teacherManageApi.getTeacherDetail(teacherId)
      
      this.setData({
        teacher: {
          ...teacher,
          experience: teacher.experience.toString(),
          rating: teacher.rating || 5
        }
      })
      
      wx.setNavigationBarTitle({
        title: '编辑导师'
      })
    } catch (error) {
      console.error('加载导师详情失败:', error)
      showToast('加载失败，请重试')
    }
  },
  
  // 表单输入
  onInputChange(e: any) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    
    this.setData({
      [`teacher.${field}`]: value
    })
  },
  
  // 评分选择
  onRatingChange(e: any) {
    const rating = parseInt(e.detail.value) + 1
    this.setData({
      'teacher.rating': rating
    })
  },
  
  // 状态切换
  onStatusChange(e: any) {
    const status = e.detail.value ? 'active' : 'inactive'
    this.setData({
      'teacher.status': status
    })
  },
  
  // 舞种选择
  onDanceTypeChange(e: any) {
    const selectedIndexes = e.detail.value
    const danceTypes = selectedIndexes.map((index: number) => 
      this.data.filterOptions.danceTypes[index].id
    )
    
    this.setData({
      'teacher.danceTypes': danceTypes
    })
  },
  
  // 门店选择
  onStoreChange(e: any) {
    const selectedIndexes = e.detail.value
    const stores = selectedIndexes.map((index: number) => 
      this.data.filterOptions.stores[index].storeId
    )
    
    this.setData({
      'teacher.stores': stores
    })
  },
  
  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        
        // 直接将临时文件路径存储，后续提交时由云数据库处理
        this.setData({
          'teacher.avatar': tempFilePath
        })
        
        showToast('头像选择成功', 'success')
      }
    })
  },
  
  // 表单验证
  validateForm() {
    const { teacher } = this.data
    
    if (!teacher.name.trim()) {
      showToast('请输入导师姓名')
      return false
    }
    
    if (!teacher.phone.trim()) {
      showToast('请输入手机号码')
      return false
    }
    
    if (!/^1[3-9]\d{9}$/.test(teacher.phone)) {
      showToast('请输入正确的手机号码')
      return false
    }
    
    if (!teacher.avatar || (typeof teacher.avatar === 'string' && !teacher.avatar.trim())) {
      showToast('请上传导师头像')
      return false
    }
    
    if (teacher.danceTypes.length === 0) {
      showToast('请选择擅长舞种')
      return false
    }
    
    if (teacher.stores.length === 0) {
      showToast('请选择所属门店')
      return false
    }
    
    if (!teacher.experience.trim() || isNaN(Number(teacher.experience))) {
      showToast('请输入正确的经验年限')
      return false
    }
    
    return true
  },
  
  // 提交表单
  async submitForm() {
    if (!this.validateForm()) return
    
    try {
      this.setData({ submitting: true })
      
      const { teacher, isEdit, teacherId } = this.data
      
      // 构建提交数据
      const submitData = {
        ...teacher,
        experience: Number(teacher.experience)
      }
      
      // 如果头像包含临时路径，转换为云数据库存储格式
      if (teacher.avatar && teacher.avatar.includes('tmp_')) {
        // 云数据库会自动处理图片存储
        submitData.avatar = {
          type: 'image',
          path: teacher.avatar
        }
      }
      
      if (isEdit) {
        // 更新导师
        await teacherManageApi.updateTeacher(teacherId, submitData)
        showToast('更新成功', 'success')
      } else {
        // 创建导师
        await teacherManageApi.createTeacher(submitData)
        showToast('创建成功', 'success')
      }
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (error) {
      console.error('提交失败:', error)
      showToast('提交失败，请重试')
      this.setData({ submitting: false })
    }
  },
  
  // 重置表单
  resetForm() {
    this.setData({
      teacher: {
        name: '',
        phone: '',
        avatar: '',
        danceTypes: [],
        stores: [],
        introduction: '',
        experience: '',
        rating: 5,
        status: 'active'
      }
    })
  },
  
  // 返回上一页
  goBack() {
    wx.navigateBack()
  }
})