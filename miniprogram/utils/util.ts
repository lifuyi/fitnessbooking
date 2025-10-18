// util.ts
/**
 * 格式化时间
 * @param date 日期对象或时间戳
 * @param format 格式化字符串，默认 'YYYY-MM-DD HH:mm'
 */
export const formatTime = (date: Date | number | string, format: string = 'YYYY-MM-DD HH:mm'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 格式化相对时间
 * @param date 日期对象或时间戳
 */
export const formatRelativeTime = (date: Date | number | string): string => {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  
  // 获取当前语言
  const language = wx.getStorageSync('language') || 'zh-CN'
  
  if (diff < minute) {
    return language === 'zh-CN' ? '刚刚' : 'Just now'
  } else if (diff < hour) {
    return language === 'zh-CN' ? `${Math.floor(diff / minute)}分钟前` : `${Math.floor(diff / minute)} minutes ago`
  } else if (diff < day) {
    return language === 'zh-CN' ? `${Math.floor(diff / hour)}小时前` : `${Math.floor(diff / hour)} hours ago`
  } else if (diff < week) {
    return language === 'zh-CN' ? `${Math.floor(diff / day)}天前` : `${Math.floor(diff / day)} days ago`
  } else if (diff < month) {
    return language === 'zh-CN' ? `${Math.floor(diff / week)}周前` : `${Math.floor(diff / week)} weeks ago`
  } else {
    return formatTime(date, 'MM-DD')
  }
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let lastTime = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

/**
 * 显示提示信息
 * @param title 提示内容
 * @param icon 图标类型
 * @param duration 持续时间
 */
export const showToast = (
  title: string,
  icon: 'success' | 'error' | 'loading' | 'none' = 'none',
  duration: number = 2000
): void => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 显示加载中
 * @param title 加载提示文字
 */
export const showLoading = (title: string = '加载中...'): void => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载中
 */
export const hideLoading = (): void => {
  wx.hideLoading()
}

/**
 * 显示确认对话框
 * @param content 对话框内容
 * @param title 对话框标题
 */
export const showModal = (
  content: string,
  title: string = '提示'
): Promise<boolean> => {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 显示操作菜单
 * @param itemList 菜单项列表
 */
export const showActionSheet = (itemList: string[]): Promise<number> => {
  return new Promise((resolve, reject) => {
    wx.showActionSheet({
      itemList,
      success: (res) => {
        resolve(res.tapIndex)
      },
      fail: reject
    })
  })
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  const app = getApp<IAppOption>()
  return app.globalData
}

/**
 * 检查登录状态
 */
export const checkLogin = (): boolean => {
  const app = getApp<IAppOption>()
  return app.globalData.isLogin || false
}

/**
 * 跳转到登录页面
 */
export const navigateToLogin = () => {
  wx.navigateTo({
    url: '/subpackage/admin/pages/login'
  })
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 */
export const generateRandomString = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    
    return clonedObj
  }
  
  return obj
}

/**
 * 手机号脱敏
 * @param phone 手机号
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) {
    return phone
  }
  
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 检查是否为今天
 * @param date 日期对象或时间戳
 */
export const isToday = (date: Date | number | string): boolean => {
  const today = new Date()
  const target = new Date(date)
  
  return today.getFullYear() === target.getFullYear() &&
         today.getMonth() === target.getMonth() &&
         today.getDate() === target.getDate()
}

/**
 * 检查是否为明天
 * @param date 日期对象或时间戳
 */
export const isTomorrow = (date: Date | number | string): boolean => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const target = new Date(date)
  
  return tomorrow.getFullYear() === target.getFullYear() &&
         tomorrow.getMonth() === target.getMonth() &&
         tomorrow.getDate() === target.getDate()
}