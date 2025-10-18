const i18n = require('./i18n.js')

// 设置tabBar语言
function setTabBarLanguage() {
  const language = i18n.getLanguage()
  
  if (language === 'en') {
    wx.setTabBarItem({
      index: 0,
      text: i18n.t('navbar.home')
    })
    
    wx.setTabBarItem({
      index: 1,
      text: i18n.t('navbar.booking')
    })
    
    wx.setTabBarItem({
      index: 2,
      text: i18n.t('navbar.profile')
    })
  } else {
    // 中文是默认的，不需要特别设置
    wx.setTabBarItem({
      index: 0,
      text: '首页'
    })
    
    wx.setTabBarItem({
      index: 1,
      text: '预约'
    })
    
    wx.setTabBarItem({
      index: 2,
      text: '我的'
    })
  }
}

// 初始化语言设置
function initLanguage() {
  setTabBarLanguage()
}

module.exports = {
  setTabBarLanguage,
  initLanguage
}