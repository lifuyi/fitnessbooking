// logs.ts
// const util = require('../../utils/util.js')
import { formatTime } from '../../utils/util'

Component({
  data: {
    logs: [],
    
    // 国际化
    i18n: null
  },
  lifetimes: {
    attached() {
      const i18n = require('../utils/i18n.js')
      this.setData({
        i18n: i18n,
        logs: (wx.getStorageSync('logs') || []).map((log: string) => {
          return {
            date: formatTime(new Date(log)),
            timeStamp: log
          }
        }),
      })
    }
  },
  
  methods: {
    // 语言切换事件处理
    onLanguageChange() {
      const i18n = require('../utils/i18n.js')
      this.setData({
        i18n: i18n
      })
    }
  }
})
