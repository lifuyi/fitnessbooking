// components/language-switch.ts
const i18nInstance = require('../utils/i18n.js')

Component({
  properties: {
    // 组件属性
  },

  data: {
    i18n: i18nInstance
  },

  lifetimes: {
    attached() {
      // 组件实例进入页面节点树时执行
      this.setData({
        i18n: i18nInstance
      })
    }
  },

  methods: {
    // 切换语言
    switchLanguage() {
      const currentLanguage = this.data.i18n.getLanguage()
      const newLanguage = currentLanguage === 'zh-CN' ? 'en' : 'zh-CN'
      
      this.data.i18n.setLanguage(newLanguage)
      this.setData({
        i18n: this.data.i18n
      })
      
      // 更新tabBar语言
      const { setTabBarLanguage } = require('../utils/language.js')
      setTabBarLanguage()
      
      // 触发自定义事件，通知页面语言已切换
      this.triggerEvent('languagechange', { language: newLanguage })
    }
  }
})