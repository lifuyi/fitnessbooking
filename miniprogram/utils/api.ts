// api.ts
import { showLoading, hideLoading, showToast, checkLogin, navigateToLogin } from './util'

// API基础配置
const BASE_URL = 'https://api.icon-dance.com' // 替换为实际API地址
const TIMEOUT = 10000

// 请求拦截器
const requestInterceptor = (options: WechatMiniprogram.RequestOption) => {
  // 显示加载中
  if (options.loading !== false) {
    showLoading(options.loadingText || '请求中...')
  }
  
  // 获取token
  const app = getApp<IAppOption>()
  const token = app.globalData.token || wx.getStorageSync('token')
  
  // 设置请求头
  options.header = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    ...options.header
  }
  
  return options
}

// 响应拦截器
const responseInterceptor = (response: WechatMiniprogram.RequestSuccessCallbackResult) => {
  hideLoading()
  
  const { statusCode, data } = response
  
  // HTTP状态码检查
  if (statusCode !== 200) {
    handleHttpError(statusCode)
    return Promise.reject(new Error(`HTTP Error: ${statusCode}`))
  }
  
  // 业务状态码检查
  if (data.code !== 0) {
    handleBusinessError(data.code, data.message)
    return Promise.reject(new Error(data.message || '请求失败'))
  }
  
  return data.data
}

// 错误处理
const handleHttpError = (statusCode: number) => {
  let message = '网络请求失败'
  
  switch (statusCode) {
    case 401:
      message = '未授权，请重新登录'
      // 清除登录信息
      const app = getApp<IAppOption>()
      app.logout()
      // 跳转到登录页
      navigateToLogin()
      break
    case 403:
      message = '拒绝访问'
      break
    case 404:
      message = '请求资源不存在'
      break
    case 500:
      message = '服务器内部错误'
      break
    case 502:
      message = '网关错误'
      break
    case 503:
      message = '服务不可用'
      break
    case 504:
      message = '网关超时'
      break
    default:
      message = `网络错误 (${statusCode})`
  }
  
  showToast(message, 'error')
}

const handleBusinessError = (code: number, message: string) => {
  showToast(message || '操作失败', 'error')
}

// 通用请求方法
const request = <T = any>(options: WechatMiniprogram.RequestOption & {
  loading?: boolean
  loadingText?: string
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    // 请求拦截
    const interceptedOptions = requestInterceptor(options)
    
    wx.request({
      ...interceptedOptions,
      url: `${BASE_URL}${options.url}`,
      timeout: options.timeout || TIMEOUT,
      success: (response) => {
        // 响应拦截
        responseInterceptor(response)
          .then(resolve)
          .catch(reject)
      },
      fail: (error) => {
        hideLoading()
        showToast('网络连接失败', 'error')
        reject(error)
      }
    })
  })
}

// GET请求
export const get = <T = any>(url: string, params?: any, options?: any): Promise<T> => {
  const queryString = params ? `?${Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')}` : ''
  
  return request<T>({
    url: `${url}${queryString}`,
    method: 'GET',
    ...options
  })
}

// POST请求
export const post = <T = any>(url: string, data?: any, options?: any): Promise<T> => {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...options
  })
}

// PUT请求
export const put = <T = any>(url: string, data?: any, options?: any): Promise<T> => {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

// DELETE请求
export const del = <T = any>(url: string, options?: any): Promise<T> => {
  return request<T>({
    url,
    method: 'DELETE',
    ...options
  })
}

// 文件上传（腾讯云数据库直接存储图片，此方法保留用于其他文件上传）
export const uploadFile = (filePath: string, url: string, formData?: any): Promise<any> => {
  showLoading('上传中...')
  
  return new Promise((resolve, reject) => {
    const app = getApp<IAppOption>()
    const token = app.globalData.token || wx.getStorageSync('token')
    
    wx.uploadFile({
      url: `${BASE_URL}${url}`,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (response) => {
        hideLoading()
        
        try {
          const data = JSON.parse(response.data)
          
          if (data.code === 0) {
            resolve(data.data)
          } else {
            showToast(data.message || '上传失败', 'error')
            reject(new Error(data.message || '上传失败'))
          }
        } catch (error) {
          showToast('上传失败', 'error')
          reject(error)
        }
      },
      fail: (error) => {
        hideLoading()
        showToast('上传失败', 'error')
        reject(error)
      }
    })
  })
}

// API接口定义
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 用户相关接口
export const userApi = {
  // 微信登录
  wxLogin: (code: string, userInfo: any) => post<any>('/auth/wx-login', { code, userInfo }),
  
  // 获取用户信息
  getUserInfo: () => get<any>('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (userInfo: any) => put<any>('/user/info', userInfo),
  
  // 退出登录
  logout: () => post<any>('/auth/logout')
}

// 门店相关接口
export const storeApi = {
  // 获取门店列表
  getStoreList: () => get<any>('/store/list'),
  
  // 获取门店详情
  getStoreDetail: (storeId: string) => get<any>(`/store/${storeId}`),
  
  // 切换门店
  switchStore: (storeId: string) => post<any>('/user/switch-store', { storeId })
}

// 课程相关接口
export const courseApi = {
  // 获取课程列表
  getCourseList: (params: {
    storeId?: string
    date?: string
    danceType?: string
    teacherId?: string
    page?: number
    limit?: number
  }) => get<any>('/course/list', params),
  
  // 获取课程详情
  getCourseDetail: (courseId: string) => get<any>(`/course/${courseId}`),
  
  // 预约课程
  bookCourse: (courseId: string) => post<any>(`/course/${courseId}/book`),
  
  // 取消预约
  cancelBooking: (bookingId: string) => post<any>(`/booking/${bookingId}/cancel`),
  
  // 获取我的预约
  getMyBookings: (params?: {
    status?: 'upcoming' | 'completed' | 'cancelled'
    page?: number
    limit?: number
  }) => get<any>('/booking/my', params)
}

// 导师相关接口
export const teacherApi = {
  // 获取导师列表
  getTeacherList: (storeId?: string) => get<any>('/teacher/list', { storeId }),
  
  // 获取导师详情
  getTeacherDetail: (teacherId: string) => get<any>(`/teacher/${teacherId}`),
  
  // 获取导师课程
  getTeacherCourses: (teacherId: string, params?: {
    page?: number
    limit?: number
  }) => get<any>(`/teacher/${teacherId}/courses`, params)
}

// 管理员导师管理接口
export const teacherManageApi = {
  // 获取导师列表（管理员）
  getTeacherList: (params?: {
    storeId?: string
    status?: string
    keyword?: string
    page?: number
    limit?: number
  }) => get<any>('/admin/teachers', params),
  
  // 获取导师详情（管理员）
  getTeacherDetail: (teacherId: string) => get<any>(`/admin/teacher/${teacherId}`),
  
  // 创建导师
  createTeacher: (teacherData: any) => post<any>('/admin/teacher', teacherData),
  
  // 更新导师信息
  updateTeacher: (teacherId: string, teacherData: any) => put<any>(`/admin/teacher/${teacherId}`, teacherData),
  
  // 删除导师
  deleteTeacher: (teacherId: string) => del<any>(`/admin/teacher/${teacherId}`),
  
  // 更新导师状态
  updateTeacherStatus: (teacherId: string, status: string) => put<any>(`/admin/teacher/${teacherId}/status`, { status }),
  
  // 批量导入导师
  importTeachers: (teachersData: any[]) => post<any>('/admin/teachers/import', { teachers: teachersData }),
  
  // 获取导师统计数据
  getTeacherStats: (params?: {
    storeId?: string
    startDate?: string
    endDate?: string
  }) => get<any>('/admin/teacher/stats', params)
}

// 管理员相关接口
export const adminApi = {
  // 管理员登录
  login: (phone: string, code: string) => post<any>('/admin/login', { phone, code }),
  
  // 获取验证码
  getSmsCode: (phone: string) => post<any>('/admin/sms-code', { phone }),
  
  // 获取课程列表
  getCourseList: (params?: any) => get<any>('/admin/courses', params),
  
  // 创建课程
  createCourse: (courseData: any) => post<any>('/admin/course', courseData),
  
  // 更新课程
  updateCourse: (courseId: string, courseData: any) => put<any>(`/admin/course/${courseId}`, courseData),
  
  // 删除课程
  deleteCourse: (courseId: string) => del<any>(`/admin/course/${courseId}`),
  
  // 获取学员列表
  getStudentList: (params?: {
    keyword?: string
    page?: number
    limit?: number
  }) => get<any>('/admin/student/list', params),
  
  // 更新学员信息
  updateStudentInfo: (studentId: string, studentData: any) => put<any>(`/admin/student/${studentId}`, studentData),
  
  // 增减学员课程次数
  updateStudentClasses: (studentId: string, classesData: any) => post<any>(`/admin/student/${studentId}/classes`, classesData),
  
  // 发送通知
  sendNotification: (notificationData: any) => post<any>('/admin/notification', notificationData),
  
  // 获取统计数据
  getStatistics: (params?: {
    storeId?: string
    startDate?: string
    endDate?: string
    type?: string
  }) => get<any>('/admin/statistics', params)
}

// 预约相关API
export const bookingApi = {
  // 获取预约列表
  getBookingList: (params?: {
    page?: number
    limit?: number
    status?: string
    dateRange?: string
  }) => get<any>('/booking/list', params),
  
  // 取消预约
  cancelBooking: (bookingId: string) => post<any>(`/booking/${bookingId}/cancel`),
  
  // 签到
  checkIn: (bookingId: string) => post<any>(`/booking/${bookingId}/checkin`),
  
  // 评价课程
  evaluateCourse: (bookingId: string, evaluationData: any) => post<any>(`/booking/${bookingId}/evaluate`, evaluationData)
}