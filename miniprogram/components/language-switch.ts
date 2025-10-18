// components/language-switch.ts

Component({
  properties: {
    // 组件属性
  },

  data: {
    i18n: null,
    languageText: 'EN'
  },

  lifetimes: {
    attached() {
      // 组件实例进入页面节点树时执行
      const i18nInstance = require('../utils/i18n.js')
      const currentLang = i18nInstance.getLanguage()
      this.setData({
        i18n: i18nInstance,
        languageText: currentLang === 'zh-CN' ? 'EN' : '中文'
      })
    }
  },

  methods: {
    // 切换语言
    switchLanguage() {
      console.log('语言切换按钮点击')
      
      const currentLanguage = this.data.i18n.getLanguage()
      const newLanguage = currentLanguage === 'zh-CN' ? 'en' : 'zh-CN'
      
      console.log('切换语言:', currentLanguage, '->', newLanguage)
      
      // 切换语言
      const i18nInstance = require('../utils/i18n.js')
      const success = i18nInstance.setLanguage(newLanguage)
      console.log('语言切换结果:', success)
      
      // 强制更新组件数据
      this.setData({
        i18n: i18nInstance,
        languageText: newLanguage === 'zh-CN' ? 'EN' : '中文'
      })
      
      // 更新tabBar语言
      const { setTabBarLanguage } = require('../utils/language.js')
      setTabBarLanguage()
      
      // 触发自定义事件，通知页面语言已切换
      this.triggerEvent('languagechange', { language: newLanguage })
      console.log('语言切换事件已触发')
    }
  }
})