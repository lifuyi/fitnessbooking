"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTomorrow = exports.isToday = exports.maskPhone = exports.deepClone = exports.generateRandomString = exports.navigateToLogin = exports.checkLogin = exports.getCurrentUser = exports.showActionSheet = exports.showModal = exports.hideLoading = exports.showLoading = exports.showToast = exports.throttle = exports.debounce = exports.formatRelativeTime = exports.formatTime = void 0;
// util.ts
/**
 * 格式化时间
 * @param date 日期对象或时间戳
 * @param format 格式化字符串，默认 'YYYY-MM-DD HH:mm'
 */
var formatTime = function (date, format) {
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
};
exports.formatTime = formatTime;
/**
 * 格式化相对时间
 * @param date 日期对象或时间戳
 */
var formatRelativeTime = function (date) {
    var now = new Date();
    var target = new Date(date);
    var diff = now.getTime() - target.getTime();
    var minute = 60 * 1000;
    var hour = 60 * minute;
    var day = 24 * hour;
    var week = 7 * day;
    var month = 30 * day;
    // 获取当前语言
    var language = wx.getStorageSync('language') || 'zh-CN';
    if (diff < minute) {
        return language === 'zh-CN' ? '刚刚' : 'Just now';
    }
    else if (diff < hour) {
        return language === 'zh-CN' ? "".concat(Math.floor(diff / minute), "\u5206\u949F\u524D") : "".concat(Math.floor(diff / minute), " minutes ago");
    }
    else if (diff < day) {
        return language === 'zh-CN' ? "".concat(Math.floor(diff / hour), "\u5C0F\u65F6\u524D") : "".concat(Math.floor(diff / hour), " hours ago");
    }
    else if (diff < week) {
        return language === 'zh-CN' ? "".concat(Math.floor(diff / day), "\u5929\u524D") : "".concat(Math.floor(diff / day), " days ago");
    }
    else if (diff < month) {
        return language === 'zh-CN' ? "".concat(Math.floor(diff / week), "\u5468\u524D") : "".concat(Math.floor(diff / week), " weeks ago");
    }
    else {
        return (0, exports.formatTime)(date, 'MM-DD');
    }
};
exports.formatRelativeTime = formatRelativeTime;
/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 */
var debounce = function (func, wait) {
    var timeout = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            func.apply(void 0, args);
        }, wait);
    };
};
exports.debounce = debounce;
/**
 * 节流函数
 * @param func 要节流的函数
 * @param wait 等待时间（毫秒）
 */
var throttle = function (func, wait) {
    var lastTime = 0;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            func.apply(void 0, args);
        }
    };
};
exports.throttle = throttle;
/**
 * 显示提示信息
 * @param title 提示内容
 * @param icon 图标类型
 * @param duration 持续时间
 */
var showToast = function (title, icon, duration) {
    if (icon === void 0) { icon = 'none'; }
    if (duration === void 0) { duration = 2000; }
    wx.showToast({
        title: title,
        icon: icon,
        duration: duration
    });
};
exports.showToast = showToast;
/**
 * 显示加载中
 * @param title 加载提示文字
 */
var showLoading = function (title) {
    if (title === void 0) { title = '加载中...'; }
    wx.showLoading({
        title: title,
        mask: true
    });
};
exports.showLoading = showLoading;
/**
 * 隐藏加载中
 */
var hideLoading = function () {
    wx.hideLoading();
};
exports.hideLoading = hideLoading;
/**
 * 显示确认对话框
 * @param content 对话框内容
 * @param title 对话框标题
 */
var showModal = function (content, title) {
    if (title === void 0) { title = '提示'; }
    return new Promise(function (resolve) {
        wx.showModal({
            title: title,
            content: content,
            success: function (res) {
                resolve(res.confirm);
            }
        });
    });
};
exports.showModal = showModal;
/**
 * 显示操作菜单
 * @param itemList 菜单项列表
 */
var showActionSheet = function (itemList) {
    return new Promise(function (resolve, reject) {
        wx.showActionSheet({
            itemList: itemList,
            success: function (res) {
                resolve(res.tapIndex);
            },
            fail: reject
        });
    });
};
exports.showActionSheet = showActionSheet;
/**
 * 获取当前用户信息
 */
var getCurrentUser = function () {
    var app = getApp();
    return app.globalData;
};
exports.getCurrentUser = getCurrentUser;
/**
 * 检查登录状态
 */
var checkLogin = function () {
    var app = getApp();
    return app.globalData.isLogin || false;
};
exports.checkLogin = checkLogin;
/**
 * 跳转到登录页面
 */
var navigateToLogin = function () {
    wx.navigateTo({
        url: '/pages/admin/login'
    });
};
exports.navigateToLogin = navigateToLogin;
/**
 * 生成随机字符串
 * @param length 字符串长度
 */
var generateRandomString = function (length) {
    if (length === void 0) { length = 8; }
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 */
var deepClone = function (obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
        return obj.map(function (item) { return (0, exports.deepClone)(item); });
    }
    if (typeof obj === 'object') {
        var clonedObj = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = (0, exports.deepClone)(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
};
exports.deepClone = deepClone;
/**
 * 手机号脱敏
 * @param phone 手机号
 */
var maskPhone = function (phone) {
    if (!phone || phone.length !== 11) {
        return phone;
    }
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};
exports.maskPhone = maskPhone;
/**
 * 检查是否为今天
 * @param date 日期对象或时间戳
 */
var isToday = function (date) {
    var today = new Date();
    var target = new Date(date);
    return today.getFullYear() === target.getFullYear() &&
        today.getMonth() === target.getMonth() &&
        today.getDate() === target.getDate();
};
exports.isToday = isToday;
/**
 * 检查是否为明天
 * @param date 日期对象或时间戳
 */
var isTomorrow = function (date) {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var target = new Date(date);
    return tomorrow.getFullYear() === target.getFullYear() &&
        tomorrow.getMonth() === target.getMonth() &&
        tomorrow.getDate() === target.getDate();
};
exports.isTomorrow = isTomorrow;
