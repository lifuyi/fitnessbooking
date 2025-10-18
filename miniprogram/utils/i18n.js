const zhCN = require('../locales/zh-CN.js')
const en = require('../locales/en.js')

// 支持的语言列表
const SUPPORTED_LANGUAGES = {
  'zh-CN': zhCN,
  'en': en
}

// 默认语言
const DEFAULT_LANGUAGE = 'zh-CN'

class I18n {
  constructor() {
    // 从本地存储获取语言设置，如果没有则使用默认语言
    this.language = wx.getStorageSync('language') || DEFAULT_LANGUAGE
    this.messages = SUPPORTED_LANGUAGES[this.language] || zhCN
  }

  // 切换语言
  setLanguage(language) {
    if (SUPPORTED_LANGUAGES[language]) {
      this.language = language
      this.messages = SUPPORTED_LANGUAGES[language]
      // 保存到本地存储
      wx.setStorageSync('language', language)
      return true
    }
    return false
  }

  // 获取当前语言
  getLanguage() {
    return this.language
  }

  // 翻译文本
  t(key, params = {}) {
    let message = this.messages[key] || key
    
    // 替换参数
    Object.keys(params).forEach(param => {
      const regex = new RegExp(`{${param}}`, 'g')
      message = message.replace(regex, params[param])
    })
    
    return message
  }

  // 获取支持的语言列表
  getSupportedLanguages() {
    return Object.keys(SUPPORTED_LANGUAGES)
  }
}

// 创建单例实例
const i18n = new I18n()

// 导出实例和类 - 使用 CommonJS 语法
module.exports = i18n
module.exports.I18n = I18n