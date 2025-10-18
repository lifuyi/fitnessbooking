/**
 * Complete WeChat Mini Program Utility Module
 * This is a working JavaScript version of the util.ts module
 */

/**
 * 格式化时间
 * @param date 日期对象或时间戳
 * @param format 格式化字符串，默认 'YYYY-MM-DD HH:mm'
 */
function formatTime(date, format) {
  if (format === void 0) { format = 'YYYY-MM-DD HH:mm'; }
  var d = new Date(date);
  var year = d.getFullYear();
  var month = String(d.getMonth() + 1);
  var day = String(d.getDate());
  var hour = String(d.getHours());
  var minute = String(d.getMinutes());
  var second = String(d.getSeconds());
  
  // Add leading zeros if needed
  if (month.length === 1) month = '0' + month;
  if (day.length === 1) day = '0' + day;
  if (hour.length === 1) hour = '0' + hour;
  if (minute.length === 1) minute = '0' + minute;
  if (second.length === 1) second = '0' + second;
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(date) {
  var now = new Date();
  var target = new Date(date);
  var diff = now.getTime() - target.getTime();
  
  var minute = 60 * 1000;
  var hour = 60 * minute;
  var day = 24 * hour;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前';
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前';
  } else {
    return Math.floor(diff / day) + '天前';
  }
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
  var inThrottle;
  return function() {
    var args = arguments;
    var context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() { inThrottle = false; }, limit);
    }
  };
}

/**
 * 显示提示框
 */
function showToast(title, icon, duration) {
  if (icon === void 0) { icon = 'none'; }
  if (duration === void 0) { duration = 2000; }
  
  return new Promise(function(resolve) {
    if (typeof wx !== 'undefined') {
      wx.showToast({
        title: title,
        icon: icon,
        duration: duration,
        success: resolve
      });
    } else {
      // Fallback for testing
      console.log('Toast:', title);
      resolve();
    }
  });
}

/**
 * 显示加载框
 */
function showLoading(title) {
  if (title === void 0) { title = '加载中...'; }
  
  return new Promise(function(resolve) {
    if (typeof wx !== 'undefined') {
      wx.showLoading({
        title: title,
        success: resolve
      });
    } else {
      console.log('Loading:', title);
      resolve();
    }
  });
}

/**
 * 隐藏加载框
 */
function hideLoading() {
  return new Promise(function(resolve) {
    if (typeof wx !== 'undefined') {
      wx.hideLoading({
        success: resolve
      });
    } else {
      console.log('Hide loading');
      resolve();
    }
  });
}

/**
 * 显示模态对话框
 */
function showModal(title, content, showCancel) {
  if (showCancel === void 0) { showCancel = true; }
  
  return new Promise(function(resolve) {
    if (typeof wx !== 'undefined') {
      wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        success: function(res) {
          resolve(res.confirm);
        }
      });
    } else {
      // Fallback for testing
      var result = confirm(content);
      resolve(result);
    }
  });
}

/**
 * 获取当前用户
 */
function getCurrentUser() {
  var app = getApp();
  return (app && app.globalData && app.globalData.userInfo) || null;
}

/**
 * 检查登录状态
 */
function checkLogin() {
  var app = getApp();
  return !!(app && app.globalData && app.globalData.isLogin);
}

/**
 * 跳转到登录页
 */
function navigateToLogin() {
  wx.navigateTo({
    url: '/pages/login/index'
  });
}

/**
 * 检查是否为今日
 */
function isToday(date) {
  var today = new Date();
  var target = new Date(date);
  
  return today.getFullYear() === target.getFullYear() &&
         today.getMonth() === target.getMonth() &&
         today.getDate() === target.getDate();
}

/**
 * 检查是否为明日
 */
function isTomorrow(date) {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var target = new Date(date);
  
  return tomorrow.getFullYear() === target.getFullYear() &&
         tomorrow.getMonth() === target.getMonth() &&
         tomorrow.getDate() === target.getDate();
}

// 导出函数
module.exports = {
  formatTime: formatTime,
  formatRelativeTime: formatRelativeTime,
  debounce: debounce,
  throttle: throttle,
  showToast: showToast,
  showLoading: showLoading,
  hideLoading: hideLoading,
  showModal: showModal,
  getCurrentUser: getCurrentUser,
  checkLogin: checkLogin,
  navigateToLogin: navigateToLogin,
  isToday: isToday,
  isTomorrow: isTomorrow
};