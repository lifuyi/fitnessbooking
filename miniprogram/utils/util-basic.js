/**
 * WeChat Mini Program Utility Functions
 * This file provides utility functions for the mini program
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
  var month = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  var hour = String(d.getHours()).padStart(2, '0');
  var minute = String(d.getMinutes()).padStart(2, '0');
  var second = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
}

/**
 * 显示提示框
 */
function showToast(title, icon, duration) {
  if (icon === void 0) { icon = 'none'; }
  if (duration === void 0) { duration = 2000; }
  
  return new Promise(function(resolve) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration,
      success: resolve
    });
  });
}

/**
 * 显示模态对话框
 */
function showModal(title, content, showCancel) {
  if (showCancel === void 0) { showCancel = true; }
  
  return new Promise(function(resolve) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      success: function(res) {
        resolve(res.confirm);
      }
    });
  });
}

/**
 * 检查登录状态
 */
function checkLogin() {
  var app = getApp();
  return !!(app && app.globalData && app.globalData.isLogin);
}

/**
 * 其他常用函数可以在这里添加
 */

// 导出函数
module.exports = {
  formatTime: formatTime,
  showToast: showToast,
  showModal: showModal,
  checkLogin: checkLogin
};