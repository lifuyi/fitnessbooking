// index.ts
import { checkLogin, showToast, formatTime, isToday, isTomorrow } from '../../utils/util-complete'
import { courseApi, storeApi, teacherApi } from '../../utils/api-complete'
import { CDN_CONFIG } from '../../utils/cdn-config'
import type { Course, Store, Teacher } from '../../utils/types'

const app = getApp<IAppOption>()

Component({
  data: {
    // 用户信息
    userInfo: null as any,
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    
    // 当前门店
    currentStore: null as Store | null,
    
    // Banner数据
    banners: CDN_CONFIG.BANNERS,
    currentBannerIndex: 0,
    
    // 导师数据
    teachers: [] as Teacher[],
    
    // 今日课程
    todayCourses: [] as Course[],
    
    // 加载状态
    loading: false,
    
    // 国际化
    i18n: null,
    
    // 翻译文本
    welcomeText: '',
    storeInfoText: '',
    storeHoursText: '',
    functionBookingText: '',
    functionPurchaseText: '',
    functionTeachersText: '',
    functionShopText: '',
    teachersSectionText: '',
    coursesTodayText: '',
    confirmButtonText: '',
    allButtonText: '',
    entranceCodeText: '入场码',
    
    // 用于强制更新页面
    updateFlag: 0
  },
  
  lifetimes: {
    attached() {
      // 初始化i18n实例
      const i18nInstance = require('../../utils/i18n.js')
      this.setData({
        i18n: i18nInstance,
        welcomeText: i18nInstance.t('index.welcome'),
        storeInfoText: i18nInstance.t('index.store.info'),
        storeHoursText: i18nInstance.t('index.store.hours'),
        functionBookingText: i18nInstance.t('index.function.booking'),
        functionPurchaseText: i18nInstance.t('index.function.purchase'),
        functionTeachersText: i18nInstance.t('index.function.teachers'),
        functionShopText: i18nInstance.t('index.function.shop'),
        teachersSectionText: i18nInstance.t('index.teachers.section'),
        coursesTodayText: i18nInstance.t('index.courses.today'),
        confirmButtonText: i18nInstance.t('button.confirm'),
        allButtonText: i18nInstance.t('button.all')
      })
      
      this.checkUserLogin()
      this.loadPageData()
    }
  },
  
  methods: {
    // 检查用户登录状态
    checkUserLogin() {
      const isLogin = checkLogin()
      
      if (isLogin) {
        const userInfo = app.globalData.userInfo
        this.setData({
          userInfo,
          hasUserInfo: true
        })
      } else {
        this.setData({
          userInfo: null,
          hasUserInfo: false
        })
      }
    },
    
    // 加载页面数据
    async loadPageData() {
      this.setData({ loading: true })
      
      try {
        await Promise.all([
          this.loadCurrentStore(),
          this.loadTeachers(),
          this.loadTodayCourses()
        ])
      } catch (error) {
        console.error('加载页面数据失败:', error)
        showToast('加载失败，请重试')
      } finally {
        this.setData({ loading: false })
      }
    },
    
    // 加载当前门店信息
    async loadCurrentStore() {
      try {
        const stores = await storeApi.getStoreList()
        const currentStoreName = app.globalData.currentStore || '南山店'
        const currentStore = stores.find((store: Store) => store.name === currentStoreName)
        
        this.setData({ currentStore })
      } catch (error) {
        console.error('加载门店信息失败:', error)
      }
    },
    
    // 加载导师列表
    async loadTeachers() {
      try {
        console.log('开始加载导师列表...')
        const teachers = await teacherApi.getTeacherList()
        console.log('获取到的导师列表:', teachers)
        
        // 确保每个导师都有必要的字段
        const processedTeachers = teachers.map(teacher => {
          const processedTeacher = { ...teacher }
          // 确保有teacherId
          if (!processedTeacher.teacherId && processedTeacher.id) {
            processedTeacher.teacherId = String(processedTeacher.id)
          }
          // 确保有头像
          if (!processedTeacher.avatar) {
            processedTeacher.avatar = '/images/default-avatar.png'
          }
          return processedTeacher
        })
        
        console.log('处理后的导师列表:', processedTeachers)
        this.setData({ teachers: processedTeachers.slice(0, 6) }) // 只显示前6个导师
      } catch (error) {
        console.error('加载导师列表失败:', error)
      }
    },
    
    // 加载今日课程
    async loadTodayCourses() {
      try {
        const today = formatTime(new Date(), 'YYYY-MM-DD')
        const result = await courseApi.getCourseList({
          date: today,
          limit: 3
        })
        
        console.log('课程API返回的数据:', result)
        
        // 处理API返回的数据格式
        let courses = result
        if (result && result.list) {
          courses = result.list
        }
        
        // 确保courses是数组
        if (!Array.isArray(courses)) {
          console.error('课程数据不是数组:', courses)
          courses = []
        }
        
        // 预处理课程数据
        courses = this.preprocessCourses(courses)
        
        this.setData({ todayCourses: courses })
      } catch (error) {
        console.error('加载今日课程失败:', error)
      }
    },
    
    // 预处理课程数据
    preprocessCourses(courses: Course[]) {
      return courses.map(course => {
        // 确保课程有必要的字段
        const processedCourse = { ...course }
        
        // 如果没有课程ID，生成一个
        if (!processedCourse.courseId && processedCourse.id) {
          processedCourse.courseId = String(processedCourse.id)
        }
        
        // 如果没有老师头像，使用默认头像
        if (!processedCourse.teacherAvatar) {
          processedCourse.teacherAvatar = '/images/default-avatar.png'
        }
        
        // 如果没有舞种类型，使用默认值
        if (!processedCourse.danceTypeName) {
          processedCourse.danceTypeName = '课程'
        }
        
        // 确保预约人数不超过容量
        if (processedCourse.bookedCount > processedCourse.capacity) {
          processedCourse.bookedCount = processedCourse.capacity
        }
        
        return processedCourse
      })
    },
    
    // 获取用户信息
    async getUserProfile() {
      try {
        // 直接调用getUserProfile获取用户信息
        wx.getUserProfile({
          desc: '用于完善会员资料',
          success: (profileRes) => {
            const userInfo = profileRes.userInfo
            
            // 获取微信登录凭证
            wx.login({
              success: (loginRes) => {
                if (loginRes.code) {
                  // 调用app中的登录方法
                  app.wxLoginWithUserInfo(loginRes.code, userInfo)
                    .then((res: any) => {
                      this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                      })
                      showToast('登录成功', 'success')
                      
                      // 重新加载页面数据
                      this.loadPageData()
                    })
                    .catch((error: any) => {
                      console.error('登录失败:', error)
                      showToast('登录失败，请重试')
                    })
                } else {
                  showToast('获取登录凭证失败', 'error')
                }
              },
              fail: (error) => {
                console.error('微信登录失败:', error)
                showToast('微信登录失败', 'error')
              }
            })
          },
          fail: (error) => {
            console.error('获取用户信息失败:', error)
            showToast('获取用户信息失败', 'error')
          }
        })
      } catch (error) {
        console.error('登录失败:', error)
        showToast('登录失败，请重试')
      }
    },
    
    // 切换门店
    async switchStore() {
      try {
        const stores = await storeApi.getStoreList()
        const storeNames = stores.map((store: Store) => store.name)
        
        const index = await wx.showActionSheet({
          itemList: storeNames
        })
        
        if (index.tapIndex !== undefined) {
          const selectedStore = stores[index.tapIndex]
          app.switchStore(selectedStore.name)
          
          this.setData({ currentStore: selectedStore })
          
          // 重新加载数据
          this.loadPageData()
          
          showToast(`已切换到${selectedStore.name}`)
        }
      } catch (error) {
        if (error.errMsg !== 'showActionSheet:fail cancel') {
          console.error('切换门店失败:', error)
          showToast('切换失败，请重试')
        }
      }
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
    
    // Banner轮播切换
    onBannerChange(e: any) {
      this.setData({
        currentBannerIndex: e.detail.current
      })
    },
    
    // 点击Banner
    onBannerTap(e: any) {
      const { index } = e.currentTarget.dataset
      console.log('点击Banner:', index)
      // 这里可以跳转到活动页面
    },
    
    // 跳转到课程预约
    navigateToBooking() {
      wx.switchTab({
        url: '/pages/course/list'
      })
    },
    
    // 跳转到导师详情
    navigateToTeacherDetail(e: any) {
      const { teacherId } = e.currentTarget.dataset
      console.log('点击导师头像，导师ID:', teacherId)
      console.log('导师数据:', this.data.teachers.find(t => t.teacherId === teacherId))
      
      wx.navigateTo({
        url: `/pages/teacher/detail?teacherId=${teacherId}`
      })
    },
    
    // 查看所有导师
    viewAllTeachers() {
      wx.navigateTo({
        url: '/pages/teacher/list'
      })
    },
    
    // 跳转到课程详情
    navigateToCourseDetail(e: any) {
      const { courseId } = e.currentTarget.dataset
      console.log('点击课程，courseId:', courseId)
      console.log('课程数据:', this.data.todayCourses.find(c => c.courseId === courseId))
      
      wx.navigateTo({
        url: `/pages/course/detail?courseId=${courseId}`
      })
    },
    
    // 查看所有课程
    viewAllCourses() {
      wx.switchTab({
        url: '/pages/course/list'
      })
    },
    
    // 拨打电话
    makePhoneCall() {
      if (this.data.currentStore) {
        wx.makePhoneCall({
          phoneNumber: this.data.currentStore.phone
        })
      }
    },
    
    // 打开地图导航
    openLocation() {
      if (this.data.currentStore) {
        wx.openLocation({
          latitude: this.data.currentStore.latitude,
          longitude: this.data.currentStore.longitude,
          name: this.data.currentStore.name,
          address: this.data.currentStore.address
        })
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
        return `${course.date.split('-').slice(1).join('-')} ${course.startTime}`
      }
    },
    
    // 获取剩余名额显示
    getRemainingText(course: Course) {
      const remaining = course.capacity - course.bookedCount
      if (remaining <= 5) {
        return `剩余${remaining}名额`
      }
      return `${remaining}/${course.capacity}名额`
    },
    
    // 获取剩余名额样式
    getRemainingClass(course: Course) {
      const remaining = course.capacity - course.bookedCount
      return remaining <= 5 ? 'text-warning' : 'text-small'
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
      
      // 重新加载页面数据以更新显示
      this.loadPageData()
    },
    
    // 翻译文本
    t(key: string, params: any = {}) {
      return this.data.i18n.t(key, params)
    },
    
    // 语言切换事件处理
    onLanguageChange(e) {
      console.log('语言切换事件触发:', e)
      
      // 获取当前的i18n实例并强制更新
      const i18nInstance = require('../../utils/i18n.js')
      const currentLang = i18nInstance.getLanguage()
      console.log('当前语言:', currentLang)
      
      // 更新页面的i18n实例
      this.setData({
        i18n: i18nInstance,
        // 强制更新所有翻译文本
        welcomeText: i18nInstance.t('index.welcome'),
        storeInfoText: i18nInstance.t('index.store.info'),
        storeHoursText: i18nInstance.t('index.store.hours'),
        functionBookingText: i18nInstance.t('index.function.booking'),
        functionPurchaseText: i18nInstance.t('index.function.purchase'),
        functionTeachersText: i18nInstance.t('index.function.teachers'),
        functionShopText: i18nInstance.t('index.function.shop'),
        teachersSectionText: i18nInstance.t('index.teachers.section'),
        coursesTodayText: i18nInstance.t('index.courses.today'),
        confirmButtonText: i18nInstance.t('button.confirm'),
        allButtonText: i18nInstance.t('button.all'),
        entranceCodeText: '入场码'
      })
      
      // 强制触发页面重新渲染
      this.setData({
        updateFlag: Date.now()
      })
      
      // 重新加载页面数据以更新显示
      this.loadPageData()
      
      console.log('语言切换完成，新语言:', i18nInstance.getLanguage())
    }
  }
})