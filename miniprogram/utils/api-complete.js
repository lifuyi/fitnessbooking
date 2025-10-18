/**
 * Complete WeChat Mini Program API Module
 * This is a working JavaScript version of the api.ts module
 */

/**
 * GET请求
 */
function get(url, params, options) {
  return new Promise(function(resolve, reject) {
    // 添加基础URL或使用模拟数据
    var fullUrl = url;
    if (url.startsWith('/api/')) {
      // 在开发环境中使用模拟数据
      if (typeof wx !== 'undefined') {
        // 微信小程序环境，返回模拟数据
        resolve(getMockData(url, params));
        return;
      } else {
        // 测试环境
        console.log('GET request:', url, params);
        resolve(getMockData(url, params));
        return;
      }
    }
    
    var requestOptions = {
      url: fullUrl,
      method: 'GET',
      data: params,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('Request failed: ' + res.statusCode));
        }
      },
      fail: function(err) {
        reject(err);
      }
    };
    
    if (options) {
      Object.assign(requestOptions, options);
    }
    
    if (typeof wx !== 'undefined') {
      wx.request(requestOptions);
    }
  });
}

/**
 * POST请求
 */
function post(url, data, options) {
  return new Promise(function(resolve, reject) {
    // 添加基础URL或使用模拟数据
    var fullUrl = url;
    if (url.startsWith('/api/')) {
      // 在开发环境中使用模拟数据
      if (typeof wx !== 'undefined') {
        // 微信小程序环境，返回模拟数据
        resolve(getMockData(url, data));
        return;
      } else {
        // 测试环境
        console.log('POST request:', url, data);
        resolve(getMockData(url, data));
        return;
      }
    }
    
    var requestOptions = {
      url: fullUrl,
      method: 'POST',
      data: data,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('Request failed: ' + res.statusCode));
        }
      },
      fail: function(err) {
        reject(err);
      }
    };
    
    if (options) {
      Object.assign(requestOptions, options);
    }
    
    if (typeof wx !== 'undefined') {
      wx.request(requestOptions);
    }
  });
}

/**
 * 获取模拟数据
 */
function getMockData(url, params) {
  switch(url) {
    case '/api/stores':
      return [
        {
          id: 1,
          name: '南山店',
          address: '深圳市南山区科技园',
          phone: '0755-88888888',
          latitude: 22.53168,
          longitude: 113.93278,
          openTime: '06:00',
          closeTime: '22:00'
        },
        {
          id: 2,
          name: '福田店',
          address: '深圳市福田区中心区',
          phone: '0755-99999999',
          latitude: 22.53788,
          longitude: 114.05788,
          openTime: '06:00',
          closeTime: '22:00'
        }
      ];
      
    case '/api/teachers':
      return [
        {
          id: 1,
          name: '张教练',
          avatar: 'https://picsum.photos/seed/teacher1/100/100.jpg',
          specialty: '瑜伽',
          experience: '5年',
          rating: 4.8,
          intro: '专业瑜伽教练，擅长多种瑜伽流派'
        },
        {
          id: 2,
          name: '李教练',
          avatar: 'https://picsum.photos/seed/teacher2/100/100.jpg',
          specialty: '健身',
          experience: '8年',
          rating: 4.9,
          intro: '资深健身教练，专注于力量训练'
        },
        {
          id: 3,
          name: '王教练',
          avatar: 'https://picsum.photos/seed/teacher3/100/100.jpg',
          specialty: '游泳',
          experience: '6年',
          rating: 4.7,
          intro: '专业游泳教练，擅长各种泳姿教学'
        },
        {
          id: 4,
          name: '刘教练',
          avatar: 'https://picsum.photos/seed/teacher4/100/100.jpg',
          specialty: '舞蹈',
          experience: '4年',
          rating: 4.8,
          intro: '舞蹈教练，精通多种舞蹈风格'
        },
        {
          id: 5,
          name: '陈教练',
          avatar: 'https://picsum.photos/seed/teacher5/100/100.jpg',
          specialty: '拳击',
          experience: '7年',
          rating: 4.9,
          intro: '专业拳击教练，注重实战技巧'
        },
        {
          id: 6,
          name: '赵教练',
          avatar: 'https://picsum.photos/seed/teacher6/100/100.jpg',
          specialty: '普拉提',
          experience: '5年',
          rating: 4.7,
          intro: '普拉提教练，专注于核心训练'
        }
      ];
      
    case '/api/courses':
      var today = new Date().toISOString().split('T')[0];
      var courses = [
        {
          id: 1,
          name: '瑜伽基础班',
          date: today,
          startTime: '09:00',
          endTime: '10:00',
          teacherId: 1,
          teacherName: '张教练',
          storeId: 1,
          storeName: '南山店',
          capacity: 20,
          bookedCount: 12,
          price: 88,
          description: '适合初学者的瑜伽课程'
        },
        {
          id: 2,
          name: '力量训练',
          date: today,
          startTime: '14:00',
          endTime: '15:30',
          teacherId: 2,
          teacherName: '李教练',
          storeId: 1,
          storeName: '南山店',
          capacity: 15,
          bookedCount: 8,
          price: 128,
          description: '增强肌肉力量，塑造完美身材'
        },
        {
          id: 3,
          name: '游泳课',
          date: today,
          startTime: '16:00',
          endTime: '17:00',
          teacherId: 3,
          teacherName: '王教练',
          storeId: 2,
          storeName: '福田店',
          capacity: 10,
          bookedCount: 7,
          price: 158,
          description: '学习正确的游泳技巧'
        },
        {
          id: 4,
          name: '爵士舞入门',
          date: today,
          startTime: '10:00',
          endTime: '11:30',
          teacherId: 4,
          teacherName: '刘教练',
          storeId: 1,
          storeName: '南山店',
          capacity: 25,
          bookedCount: 18,
          price: 98,
          description: '学习基础爵士舞步'
        },
        {
          id: 5,
          name: '拳击训练',
          date: today,
          startTime: '19:00',
          endTime: '20:30',
          teacherId: 5,
          teacherName: '陈教练',
          storeId: 2,
          storeName: '福田店',
          capacity: 12,
          bookedCount: 10,
          price: 138,
          description: '专业拳击技巧训练'
        },
        {
          id: 6,
          name: '普拉提核心',
          date: today,
          startTime: '18:00',
          endTime: '19:00',
          teacherId: 6,
          teacherName: '赵教练',
          storeId: 1,
          storeName: '南山店',
          capacity: 15,
          bookedCount: 9,
          price: 108,
          description: '强化核心肌群训练'
        }
      ];
      
      // 返回分页格式
      var page = params.page || 1;
      var limit = params.limit || 10;
      var start = (page - 1) * limit;
      var end = start + limit;
      
      return {
        list: courses.slice(start, end),
        total: courses.length,
        page: page,
        limit: limit,
        hasMore: end < courses.length
      };
      
    case '/api/user/bookings':
      var today = new Date().toISOString().split('T')[0];
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var tomorrowStr = tomorrow.toISOString().split('T')[0];
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var yesterdayStr = yesterday.toISOString().split('T')[0];
      
      var allBookings = [
        {
          bookingId: 'b1',
          courseId: 'c1',
          courseName: '爵士舞基础',
          danceTypeName: '爵士舞',
          teacherName: 'BOA',
          teacherAvatar: 'https://picsum.photos/seed/boa/100/100.jpg',
          storeName: '南山店',
          date: today,
          startTime: '19:00',
          endTime: '20:30',
          status: 'booked',
          price: 98,
          bookedAt: today + ' 18:00:00'
        },
        {
          bookingId: 'b2',
          courseId: 'c2',
          courseName: '瑜伽进阶',
          danceTypeName: '瑜伽',
          teacherName: 'LISA',
          teacherAvatar: 'https://picsum.photos/seed/lisa/100/100.jpg',
          storeName: '福田店',
          date: tomorrowStr,
          startTime: '10:00',
          endTime: '11:30',
          status: 'booked',
          price: 88,
          bookedAt: today + ' 09:00:00'
        },
        {
          bookingId: 'b3',
          courseId: 'c3',
          courseName: '力量训练',
          danceTypeName: '健身',
          teacherName: 'QURY',
          teacherAvatar: 'https://picsum.photos/seed/qury/100/100.jpg',
          storeName: '南山店',
          date: yesterdayStr,
          startTime: '14:00',
          endTime: '15:30',
          status: 'completed',
          price: 128,
          bookedAt: yesterdayStr + ' 13:00:00'
        },
        {
          bookingId: 'b4',
          courseId: 'c4',
          courseName: '游泳课',
          danceTypeName: '游泳',
          teacherName: '张教练',
          teacherAvatar: 'https://picsum.photos/seed/teacher1/100/100.jpg',
          storeName: '福田店',
          date: yesterdayStr,
          startTime: '16:00',
          endTime: '17:00',
          status: 'cancelled',
          price: 158,
          bookedAt: yesterdayStr + ' 15:00:00'
        }
      ];
      
      // 根据参数筛选
      var filteredBookings = allBookings;
      if (params && params.status && params.status !== 'all') {
        filteredBookings = allBookings.filter(function(booking) {
          return booking.status === params.status;
        });
      }
      
      // 分页处理
      var page = params && params.page ? params.page : 1;
      var limit = params && params.limit ? params.limit : 10;
      var start = (page - 1) * limit;
      var end = start + limit;
      
      return {
        list: filteredBookings.slice(start, end),
        total: filteredBookings.length,
        page: page,
        limit: limit,
        hasMore: end < filteredBookings.length
      };
      
    default:
      return { success: true, data: {} };
  }
}

/**
 * 用户API
 */
var userApi = {
  getUserInfo: function() {
    return get('/api/user/info');
  },
  updateUserInfo: function(data) {
    return post('/api/user/info', data);
  },
  getUserBookings: function(page, limit, status) {
    if (page === void 0) { page = 1; }
    if (limit === void 0) { limit = 10; }
    return get('/api/user/bookings', { page: page, limit: limit, status: status });
  },
  getUserCourseCards: function() {
    return get('/api/user/course-cards');
  },
  generateEntranceCode: function() {
    return post('/api/user/entrance-code');
  },
  logout: function() {
    return post('/api/user/logout');
  }
};

/**
 * 课程API
 */
var courseApi = {
  getCourses: function(params) {
    return get('/api/courses', params);
  },
  getCourseList: function(params) {
    return get('/api/courses', params);
  },
  getCourseDetail: function(id) {
    return get('/api/courses/' + id);
  },
  bookCourse: function(courseId) {
    return post('/api/courses/' + courseId + '/book');
  },
  cancelBooking: function(bookingId) {
    return post('/api/bookings/' + bookingId + '/cancel');
  },
  checkIn: function(bookingId) {
    return post('/api/bookings/' + bookingId + '/checkin');
  },
  getUserCourses: function(page, limit) {
    if (page === void 0) { page = 1; }
    if (limit === void 0) { limit = 10; }
    return get('/api/user/courses', { page: page, limit: limit });
  },
  getMyBookings: function(params) {
    return get('/api/user/bookings', params);
  }
};

/**
 * 门店API
 */
var storeApi = {
  getStores: function() {
    return get('/api/stores');
  },
  getStoreList: function() {
    return get('/api/stores');
  },
  getStoreDetail: function(id) {
    return get('/api/stores/' + id);
  }
};

/**
 * 导师API
 */
var teacherApi = {
  getTeachers: function(params) {
    return get('/api/teachers', params);
  },
  getTeacherList: function(params) {
    return get('/api/teachers', params);
  },
  getTeacherDetail: function(id) {
    return get('/api/teachers/' + id);
  }
};

/**
 * 管理员API
 */
var adminApi = {
  adminLogin: function(phone, code) {
    return post('/api/admin/login', { phone: phone, code: code });
  },
  getAdminInfo: function() {
    return get('/api/admin/info');
  },
  getStatistics: function(params) {
    return get('/api/admin/statistics', params);
  },
  getSystemConfig: function() {
    return get('/api/admin/system-config');
  },
  updateSystemConfig: function(config) {
    return post('/api/admin/system-config', config);
  }
};

/**
 * 预约API
 */
var bookingApi = {
  getBookings: function(params) {
    return get('/api/bookings', params);
  },
  getBookingDetail: function(id) {
    return get('/api/bookings/' + id);
  },
  updateBookingStatus: function(id, status) {
    return post('/api/bookings/' + id + '/status', { status: status });
  },
  getBookingStats: function() {
    return get('/api/bookings/stats');
  }
};

// 导出API
module.exports = {
  get: get,
  post: post,
  userApi: userApi,
  courseApi: courseApi,
  storeApi: storeApi,
  teacherApi: teacherApi,
  adminApi: adminApi,
  bookingApi: bookingApi
};