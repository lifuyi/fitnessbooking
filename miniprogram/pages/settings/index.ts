// settings/index.ts
const app = getApp<IAppOption>()

Page({
  data: {
    currentLanguage: '中文',
    currentStore: '南山店'
  },
  
  onLoad() {
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: '设置'
    })
    
    // 获取当前语言
    const language = app.globalData.language || 'zh-CN'
    this.setData({
      currentLanguage: language === 'zh-CN' ? '中文' : 'English',
      currentStore: app.globalData.currentStore || '南山店'
    })
  },
  
  // 切换语言
  switchLanguage() {
    const currentLanguage = app.globalData.language || 'zh-CN'
    const newLanguage = currentLanguage === 'zh-CN' ? 'en' : 'zh-CN'
    
    // 使用全局方法切换语言
    app.switchLanguage(newLanguage)
    
    // 更新页面显示
    this.setData({
      currentLanguage: newLanguage === 'zh-CN' ? '中文' : 'English'
    })
    
    // 提示用户
    wx.showToast({
      title: newLanguage === 'zh-CN' ? '已切换到中文' : 'Switched to English',
      icon: 'success'
    })
    
    // 通知所有页面更新语言
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.onLanguageChange) {
        page.onLanguageChange()
      }
    })
  },
  
  // 切换门店
  switchStore() {
    const stores = ['南山店', '福田店', '罗湖店']
    const currentStore = app.globalData.currentStore || '南山店'
    const currentIndex = stores.indexOf(currentStore)
    const nextIndex = (currentIndex + 1) % stores.length
    const newStore = stores[nextIndex]
    
    // 更新全局门店信息
    app.switchStore(newStore)
    
    // 更新页面显示
    this.setData({
      currentStore: newStore
    })
    
    // 提示用户
    wx.showToast({
      title: `已切换到${newStore}`,
      icon: 'success'
    })
  },
  
  // 显示关于我们
  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '福田石厦Home 24h自助舞蹈室\n\n版本：1.0.0\n\n致力于提供优质的舞蹈教学服务',
      showCancel: false
    })
  }
})