// admin/statistics.ts
import { showToast, formatTime } from '../../../utils/util-complete'
import { adminApi, storeApi } from '../../../utils/api-complete'
import type { Statistics, Store } from '../../../utils/types'
const i18n = require('../../../utils/i18n.js')
const app = getApp<IAppOption>()

Component({
  data: {
    // 统计数据
    statistics: null as Statistics | null,
    
    // 筛选条件
    filters: {
      storeId: 'all',
      period: 'month' as 'day' | 'week' | 'month'
    },
    
    // 筛选选项
    filterOptions: {
      stores: [] as Store[]
    },
    
    // 加载状态
    loading: false,
    
    // 图表配置
    chartOptions: {
      bookingTrend: {
        categories: [] as string[],
        series: [{
          name: '预约量',
          data: [] as number[]
        }]
      },
      danceTypeStats: {
        categories: [] as string[],
        series: [{
          name: '预约量',
          data: [] as number[]
        }]
      },
      teacherStats: {
        categories: [] as string[],
        series: [{
          name: '带课次数',
          data: [] as number[]
        }]
      }
    },
    
    // 国际化
    i18n: i18n
  },
  
  lifetimes: {
    attached() {
      this.checkAdminLogin()
      this.loadFilterOptions()
      this.loadStatistics()
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
    
    // 加载统计数据
    async loadStatistics() {
      try {
        this.setData({ loading: true })
        
        const { filters } = this.data
        
        // 构建查询参数
        const params: any = {
          period: filters.period
        }
        
        if (filters.storeId !== 'all') {
          params.storeId = filters.storeId
        }
        
        // 模拟API调用
        const statistics = {
          period: {
            startDate: '2023-10-01',
            endDate: '2023-10-31',
            type: 'month'
          },
          overview: {
            totalBookings: 356,
            totalUsers: 128,
            activeUsers: 89,
            newUsers: 12,
            totalRevenue: 0 // 一期为0，二期扩展
          },
          storeStats: [
            {
              storeId: 's1',
              storeName: '南山店',
              bookings: 210,
              users: 75,
              revenue: 0
            },
            {
              storeId: 's2',
              storeName: '福田店',
              bookings: 146,
              users: 53,
              revenue: 0
            }
          ],
          danceTypeStats: [
            {
              danceType: 'jazz',
              danceTypeName: '爵士舞',
              bookings: 156,
              percentage: 43.8
            },
            {
              danceType: 'kpop',
              danceTypeName: '韩舞',
              bookings: 98,
              percentage: 27.5
            },
            {
              danceType: 'hiphop',
              danceTypeName: '街舞',
              bookings: 65,
              percentage: 18.3
            },
            {
              danceType: 'waacking',
              danceTypeName: 'Waacking',
              bookings: 37,
              percentage: 10.4
            }
          ],
          teacherStats: [
            {
              teacherId: 't1',
              teacherName: 'BOA',
              bookings: 89,
              classes: 12,
              rating: 4.8
            },
            {
              teacherId: 't2',
              teacherName: 'QURY',
              bookings: 76,
              classes: 10,
              rating: 4.7
            },
            {
              teacherId: 't3',
              teacherName: 'LISA',
              bookings: 65,
              classes: 8,
              rating: 4.9
            }
          ],
          bookingTrend: [
            {
              date: '2023-10-01',
              bookings: 12,
              users: 8
            },
            {
              date: '2023-10-08',
              bookings: 15,
              users: 10
            },
            {
              date: '2023-10-15',
              bookings: 18,
              users: 12
            },
            {
              date: '2023-10-22',
              bookings: 14,
              users: 9
            },
            {
              date: '2023-10-29',
              bookings: 16,
              users: 11
            }
          ]
        }
        
        // 处理图表数据
        this.processChartData(statistics)
        
        this.setData({
          statistics,
          loading: false
        })
      } catch (error) {
        console.error('加载统计数据失败:', error)
        showToast('加载失败，请重试')
        this.setData({ loading: false })
      }
    },
    
    // 处理图表数据
    processChartData(statistics: Statistics) {
      // 预约趋势图
      const bookingTrendCategories = statistics.bookingTrend.map(item => {
        const date = new Date(item.date)
        return formatTime(date, 'MM-DD')
      })
      const bookingTrendData = statistics.bookingTrend.map(item => item.bookings)
      
      // 舞种统计图
      const danceTypeCategories = statistics.danceTypeStats.map(item => item.danceTypeName)
      const danceTypeData = statistics.danceTypeStats.map(item => item.bookings)
      
      // 教练统计图
      const teacherCategories = statistics.teacherStats.map(item => item.teacherName)
      const teacherData = statistics.teacherStats.map(item => item.classes)
      
      this.setData({
        'chartOptions.bookingTrend.categories': bookingTrendCategories,
        'chartOptions.bookingTrend.series[0].data': bookingTrendData,
        'chartOptions.danceTypeStats.categories': danceTypeCategories,
        'chartOptions.danceTypeStats.series[0].data': danceTypeData,
        'chartOptions.teacherStats.categories': teacherCategories,
        'chartOptions.teacherStats.series[0].data': teacherData
      })
    },
    
    // 切换门店
    switchStore(e: any) {
      const storeId = e.detail.value
      const stores = ['all', ...this.data.filterOptions.stores.map(store => store.storeId)]
      const selectedStoreId = stores[storeId]
      
      this.setData({
        'filters.storeId': selectedStoreId
      })
      
      this.loadStatistics()
    },
    
    // 切换时间周期
    switchPeriod(e: any) {
      const period = e.detail.value
      const periods = ['day', 'week', 'month']
      const selectedPeriod = periods[period] as 'day' | 'week' | 'month'
      
      this.setData({
        'filters.period': selectedPeriod
      })
      
      this.loadStatistics()
    },
    
    // 导出报表
    exportReport(e: any) {
      const { type } = e.currentTarget.dataset
      
      showToast(`正在导出${type === 'excel' ? 'Excel' : '图片'}报表...`)
      
      // 这里应该实现实际的导出逻辑
      setTimeout(() => {
        showToast('导出成功', 'success')
      }, 1500)
    },
    
    // 格式化日期范围
    formatDateRange(period: any) {
      const { startDate, endDate } = period
      
      if (period.type === 'day') {
        return formatTime(new Date(startDate), 'YYYY-MM-DD')
      } else if (period.type === 'week') {
        const start = formatTime(new Date(startDate), 'MM-DD')
        const end = formatTime(new Date(endDate), 'MM-DD')
        return `${start} 至 ${end}`
      } else {
        return formatTime(new Date(startDate), 'YYYY-MM')
      }
    },
    
    // 获取门店选项文本
    getStoreOptionText() {
      const { filters, filterOptions } = this.data
      
      if (filters.storeId === 'all') {
        return '全部门店'
      }
      
      const store = filterOptions.stores.find(item => item.storeId === filters.storeId)
      return store ? store.name : '全部门店'
    },
    
    // 获取时间周期选项文本
    getPeriodOptionText() {
      const { filters } = this.data
      
      const periodMap: { [key: string]: string } = {
        'day': '今日',
        'week': '本周',
        'month': '本月'
      }
      
      return periodMap[filters.period] || '本月'
    },
    
    // 获取门店选项列表
    getStoreOptions() {
      const { filterOptions } = this.data
      
      return ['全部门店', ...filterOptions.stores.map(store => store.name)]
    },
    
    // 获取时间周期选项列表
    getPeriodOptions() {
      return ['今日', '本周', '本月']
    },
    
    // 语言切换事件处理
    onLanguageChange() {
      this.setData({
        i18n: i18n
      })
    }
  }
})