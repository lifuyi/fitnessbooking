/**
 * WeChat Mini Program API Wrapper
 * Basic API functions for the mini program
 */

/**
 * GET请求
 */
function get(url, params, options) {
  return new Promise(function(resolve, reject) {
    var requestOptions = {
      url: url,
      method: 'GET',
      data: params,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('Request failed: ' + res.statusCode));
        }
      },
      fail: reject
    };
    
    if (options) {
      Object.assign(requestOptions, options);
    }
    
    wx.request(requestOptions);
  });
}

/**
 * POST请求
 */
function post(url, data, options) {
  return new Promise(function(resolve, reject) {
    var requestOptions = {
      url: url,
      method: 'POST',
      data: data,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error('Request failed: ' + res.statusCode));
        }
      },
      fail: reject
    };
    
    if (options) {
      Object.assign(requestOptions, options);
    }
    
    wx.request(requestOptions);
  });
}

/**
 * Basic API objects
 */
var courseApi = {
  getCourses: function(params) {
    return get('/api/courses', params);
  },
  getCourseDetail: function(id) {
    return get('/api/courses/' + id);
  }
};

var userApi = {
  getUserInfo: function() {
    return get('/api/user/info');
  }
};

// 导出API
module.exports = {
  get: get,
  post: post,
  courseApi: courseApi,
  userApi: userApi
};