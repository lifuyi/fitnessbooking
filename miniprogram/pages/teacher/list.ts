// teacher/list.ts
import { showToast } from '../../utils/util-complete'
import { teacherApi } from '../../utils/api-complete'
const i18n = require('../../utils/i18n.js')
import type { Teacher } from '../../utils/types'

Component({
  data: {
    // 教练列表
    teachers: [] as Teacher[],
    
    // 筛选条件
    filters: {
      danceType: 'all',
      store: 'all'
    },
    
    // 筛选选项
    filterOptions: {
      danceTypes: [],
      stores: []
    },
    
    // 国际化
    i18n: null,
    
    // 响应式翻译变量
    teachersTitleText: '',
    danceTypeText: '',
    storeText: '',
    specialtiesText: '',
    experienceText: '',
    coursesText: '',
    sessionsText: '',
    noInfoText: '',
    loadMoreText: '',
    loadingText: '',
    noMoreText: '',
    headerTitleText: '',
    
    // 当前筛选选项文本
    currentDanceTypeText: '',
    currentStoreText: '',
    danceTypeOptions: [],
    storeOptions: [],
    
    // 加载状态
    loading: false,
    loadingMore: false,
    
    // 分页
    page: 1,
    pageSize: 10,
    hasMore: true
  },
  
  lifetimes: {
    attached() {
      // 使用全局i18n实例
      const app = getApp<IAppOption>()
      const i18nInstance = app.globalData.i18n
      
      // 初始化翻译变量
      this.updateTranslationTexts(i18nInstance)
      
      // 初始化筛选选项
      const danceTypes = [
        { value: 'all', text: i18nInstance.t('filter.all') + i18nInstance.t('course.dance.type') },
        { value: 'jazz', text: '爵士舞' },
        { value: 'kpop', text: '韩舞' },
        { value: 'hiphop', text: '街舞' },
        { value: 'waacking', text: 'Waacking' }
      ]
      
      const stores = [
        { value: 'all', text: i18nInstance.t('filter.all') + i18nInstance.t('course.store') },
        { value: 'nanshan', text: '南山店' },
        { value: 'futian', text: '福田店' },
        { value: 'baoan', text: '宝安店' }
      ]
      
      this.setData({
        i18n: i18nInstance,
        'filterOptions.danceTypes': danceTypes,
        'filterOptions.stores': stores,
        currentDanceTypeText: danceTypes[0].text,
        currentStoreText: stores[0].text,
        danceTypeOptions: danceTypes.map(item => item.text),
        storeOptions: stores.map(item => item.text),
        headerTitleText: i18nInstance.t('index.function.teachers')
      })
      
      this.loadTeachers()
    }
  },
  
  pageLifetimes: {
    show() {
      // 页面显示时刷新数据和语言设置
      const app = getApp<IAppOption>()
      const i18nInstance = app.globalData.i18n
      this.setData({ 
        i18n: i18nInstance,
        headerTitleText: i18nInstance.t('index.function.teachers')
      })
      this.refreshData()
    },
    
    // 下拉刷新
    onPullDownRefresh() {
      this.refreshData().then(() => {
        wx.stopPullDownRefresh()
      })
    },
    
    // 上拉加载更多
    onReachBottom() {
      if (this.data.hasMore && !this.data.loadingMore) {
        this.loadMoreTeachers()
      }
    }
  },
  
  methods: {
    // 刷新数据
    async refreshData() {
      this.setData({
        page: 1,
        hasMore: true,
        teachers: []
      })
      
      await this.loadTeachers()
    },
    
    // 加载导师列表
    async loadTeachers() {
      try {
        this.setData({ loading: true })
        
        const { filters, page, pageSize } = this.data
        
        // 构建查询参数
        const params: any = {
          page,
          limit: pageSize
        }
        
        if (filters.danceType !== 'all') {
          params.danceType = filters.danceType
        }
        
        if (filters.store !== 'all') {
          params.store = filters.store
        }
        
        // 模拟API调用
        const teachers = [
          {
            teacherId: 't1',
            name: 'BOA',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=200&h=200&fit=crop&crop=face',
            danceTypes: ['jazz', 'kpop'],
            specialties: ['爵士舞基础', '韩舞编舞'],
            experience: '5年',
            rating: 4.8,
            classCount: 156,
            intro: '专业爵士舞和韩舞教练，擅长基础教学和编舞创作',
            store: 'nanshan'
          },
          {
            teacherId: 't2',
            name: 'QURY',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
            danceTypes: ['hiphop'],
            specialties: ['街舞基础', 'Freestyle'],
            experience: '8年',
            rating: 4.7,
            classCount: 203,
            intro: '资深街舞教练，擅长各种街舞风格和Freestyle',
            store: 'futian'
          },
          {
            teacherId: 't3',
            name: 'LISA',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
            danceTypes: ['kpop', 'waacking'],
            specialties: ['韩舞女团', 'Waacking技巧'],
            experience: '6年',
            rating: 4.9,
            classCount: 178,
            intro: '韩舞和Waacking专业教练，女团风格教学专家',
            store: 'nanshan'
          },
          {
            teacherId: 't4',
            name: 'MIKE',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
            danceTypes: ['jazz', 'hiphop'],
            specialties: ['爵士舞进阶', '街舞融合'],
            experience: '7年',
            rating: 4.6,
            classCount: 142,
            intro: '爵士舞和街舞融合创新教练，擅长多元化风格教学',
            store: 'baoan'
          }
        ]
        
        // 应用筛选
        let filteredTeachers = teachers
        if (filters.danceType !== 'all') {
          filteredTeachers = teachers.filter(teacher => 
            teacher.danceTypes.includes(filters.danceType)
          )
        }
        
        if (filters.store !== 'all') {
          filteredTeachers = filteredTeachers.filter(teacher => 
            teacher.store === filters.store
          )
        }
        
        // 分页处理
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const pageTeachers = filteredTeachers.slice(startIndex, endIndex)
        
        // 合并数据
        const newTeachers = page === 1 ? pageTeachers : [...this.data.teachers, ...pageTeachers]
        
        this.setData({
          teachers: newTeachers,
          loading: false,
          hasMore: endIndex < filteredTeachers.length,
          page: page + 1
        })
      } catch (error) {
        console.error('加载教练列表失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 加载更多教练
    async loadMoreTeachers() {
      this.setData({ loadingMore: true })
      
      try {
        await this.loadTeachers()
      } finally {
        this.setData({ loadingMore: false })
      }
    },
    
    // 切换舞种筛选
    switchDanceType(e: any) {
      const index = e.detail.value
      const danceTypeOption = this.data.filterOptions.danceTypes[index]
      
      this.setData({
        'filters.danceType': danceTypeOption.value,
        currentDanceTypeText: danceTypeOption.text
      })
      
      this.refreshData()
    },
    
    // 切换门店筛选
    switchStore(e: any) {
      const index = e.detail.value
      const storeOption = this.data.filterOptions.stores[index]
      
      this.setData({
        'filters.store': storeOption.value,
        currentStoreText: storeOption.text
      })
      
      this.refreshData()
    },
    
    
    
    // 跳转到教练详情
    navigateToTeacherDetail(e: any) {
      const { teacherId } = e.currentTarget.dataset
      wx.navigateTo({
        url: `/pages/teacher/detail?teacherId=${teacherId}`
      })
    },
    
    // 格式化舞种显示
    formatDanceTypes(danceTypes: string[]) {
      const danceTypeMap: { [key: string]: string } = {
        'jazz': '爵士舞',
        'kpop': '韩舞',
        'hiphop': '街舞',
        'waacking': 'Waacking'
      }
      
      return danceTypes.map(type => danceTypeMap[type] || type).join(' / ')
    },
    
    // 获取评分星星
    getRatingStars(rating: number) {
      const fullStars = Math.floor(rating)
      const hasHalfStar = rating % 1 >= 0.5
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
      
      let stars = ''
      for (let i = 0; i < fullStars; i++) {
        stars += '★'
      }
      if (hasHalfStar) {
        stars += '☆'
      }
      for (let i = 0; i < emptyStars; i++) {
        stars += '☆'
      }
      
      return stars
    },
    
    // 切换语言
    switchLanguage() {
      const app = getApp<IAppOption>()
      const currentLanguage = this.data.i18n.getLanguage()
      const newLanguage = currentLanguage === 'zh-CN' ? 'en' : 'zh-CN'
      
      // 使用全局方法切换语言
      app.switchLanguage(newLanguage)
      this.setData({
        i18n: app.globalData.i18n
      })
    },
    
    // 翻译文本
    t(key: string, params: any = {}) {
      return this.data.i18n.t(key, params)
    },
    
    // 更新翻译文本
    updateTranslationTexts(i18nInstance: any) {
      this.setData({
        teachersTitleText: i18nInstance.t('index.function.teachers'),
        danceTypeText: i18nInstance.t('course.dance.type'),
        storeText: i18nInstance.t('course.store'),
        specialtiesText: i18nInstance.t('teacher.specialties'),
        experienceText: i18nInstance.t('teacher.experience'),
        coursesText: i18nInstance.t('teacher.courses'),
        sessionsText: i18nInstance.t('teacher.sessions'),
        noInfoText: i18nInstance.t('teacher.no.info'),
        loadMoreText: i18nInstance.t('teacher.load.more'),
        loadingText: i18nInstance.t('text.loading'),
        noMoreText: i18nInstance.t('teacher.no.more')
      })
    },
    
    // 语言切换事件处理
    onLanguageChange() {
      // 使用全局app实例
      const app = getApp<IAppOption>()
      const i18nInstance = app.globalData.i18n
      
      // 更新翻译文本
      this.updateTranslationTexts(i18nInstance)
      
      // 更新筛选选项
      const danceTypes = [
        { value: 'all', text: i18nInstance.t('filter.all') + i18nInstance.t('course.dance.type') },
        { value: 'jazz', text: '爵士舞' },
        { value: 'kpop', text: '韩舞' },
        { value: 'hiphop', text: '街舞' },
        { value: 'waacking', text: 'Waacking' }
      ]
      
      const stores = [
        { value: 'all', text: i18nInstance.t('filter.all') + i18nInstance.t('course.store') },
        { value: 'nanshan', text: '南山店' },
        { value: 'futian', text: '福田店' },
        { value: 'baoan', text: '宝安店' }
      ]
      
      // 更新当前选中的选项文本
      const currentDanceType = this.data.filterOptions.danceTypes.find(item => item.value === this.data.filters.danceType)
      const currentStore = this.data.filterOptions.stores.find(item => item.value === this.data.filters.store)
      
      // 更新页面的i18n实例和筛选选项
      this.setData({
        i18n: i18nInstance,
        'filterOptions.danceTypes': danceTypes,
        'filterOptions.stores': stores,
        currentDanceTypeText: currentDanceType ? currentDanceType.text : danceTypes[0].text,
        currentStoreText: currentStore ? currentStore.text : stores[0].text,
        danceTypeOptions: danceTypes.map(item => item.text),
        storeOptions: stores.map(item => item.text)
      })
      
      // 重新加载页面数据以更新显示
      this.loadTeachers()
    }
  }
})