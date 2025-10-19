// cards/index.ts
import { showToast } from '../../utils/util-complete'
import type { UserCourseCard } from '../../utils/types'

const app = getApp<IAppOption>()

Page({
  data: {
    courseCards: [] as UserCourseCard[],
    loading: true
  },
  
  onLoad() {
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '我的课程卡'
    })
    
    this.loadCourseCards()
  },
  
  // 加载课程卡数据
  async loadCourseCards() {
    try {
      this.setData({ loading: true })
      
      // 模拟API调用
      const courseCards = [
        {
          userCardId: 'uc1',
          cardId: 'c1',
          cardName: '爵士舞次卡',
          userId: app.globalData.userId || '',
          danceType: '爵士舞',
          remainingCount: 5,
          totalCount: 10,
          purchaseTime: '2023-10-01',
          expireTime: '2024-01-01',
          status: 'active'
        },
        {
          userCardId: 'uc2',
          cardId: 'c2',
          cardName: '韩舞次卡',
          userId: app.globalData.userId || '',
          danceType: '韩舞',
          remainingCount: 3,
          totalCount: 5,
          purchaseTime: '2023-10-15',
          expireTime: '2023-12-15',
          status: 'active'
        },
        {
          userCardId: 'uc3',
          cardId: 'c3',
          cardName: '芭蕾舞次卡',
          userId: app.globalData.userId || '',
          danceType: '芭蕾舞',
          remainingCount: 0,
          totalCount: 8,
          purchaseTime: '2023-08-01',
          expireTime: '2023-11-01',
          status: 'used_up'
        }
      ]
      
      this.setData({ courseCards })
    } catch (error) {
      console.error('加载课程卡失败:', error)
      showToast('加载失败，请重试')
    } finally {
      this.setData({ loading: false })
    }
  },
  
  // 续费课程卡
  rechargeCard(e: any) {
    const { cardId } = e.currentTarget.dataset
    
    wx.showModal({
      title: '续费课程卡',
      content: '续费功能暂未开放，请联系线下客服',
      showCancel: false
    })
  },
  
  // 查看课程卡详情
  viewCardDetail(e: any) {
    const { cardId } = e.currentTarget.dataset
    
    wx.showModal({
      title: '课程卡详情',
      content: '详情功能开发中，敬请期待',
      showCancel: false
    })
  },
  
  // 购买课程卡
  buyCard() {
    wx.showModal({
      title: '购买课程卡',
      content: '线上购买功能暂未开放，请联系线下客服',
      showCancel: false
    })
  },
  
  // 获取课程卡状态文本
  getCourseCardStatusText(status: string) {
    switch (status) {
      case 'active':
        return '有效'
      case 'expired':
        return '已过期'
      case 'used_up':
        return '已用完'
      default:
        return '未知'
    }
  },
  
  // 获取课程卡状态样式
  getCourseCardStatusClass(status: string) {
    switch (status) {
      case 'active':
        return 'status-success'
      case 'expired':
        return 'status-warning'
      case 'used_up':
        return 'status-error'
      default:
        return 'status-default'
    }
  }
})