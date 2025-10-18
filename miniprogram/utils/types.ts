// utils/types.ts

// 用户相关类型
export interface UserInfo {
  userId: string
  avatarUrl: string
  nickName: string
  unionid: string
  phone?: string
  currentStore?: string
  remainingClasses: Record<string, number>
  createTime: string
  updateTime: string
}

// 门店相关类型
export interface Store {
  storeId: string
  name: string
  address: string
  phone: string
  businessHours: string
  latitude: number
  longitude: number
  bannerImages: string[]
  description?: string
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
}

// 舞种类型
export interface DanceType {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  status: 'active' | 'inactive'
  sort: number
}

// 导师相关类型
export interface Teacher {
  teacherId: string
  name: string
  avatar: string
  phone: string
  danceTypes: string[]
  stores: string[]
  introduction: string
  experience: number
  rating: number
  classCount: number
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
}

// 课程相关类型
export interface Course {
  courseId: string
  name: string
  description: string
  coverImage: string
  storeId: string
  storeName: string
  teacherId: string
  teacherName: string
  teacherAvatar: string
  danceType: string
  danceTypeName: string
  difficulty: number // 1-5星难度
  date: string
  startTime: string
  endTime: string
  duration: number // 课程时长（分钟）
  capacity: number // 总名额
  bookedCount: number // 已预约人数
  price: number // 价格（一期为0，表示免费或消耗次数）
  consumeType: 'free' | 'class_card' // 消耗类型
  consumeCardType?: string // 消耗的卡种类型
  tags: string[] // 标签
  status: 'active' | 'cancelled' | 'completed'
  createTime: string
  updateTime: string
}

// 预约相关类型
export interface Booking {
  bookingId: string
  courseId: string
  courseName: string
  userId: string
  userName: string
  userAvatar: string
  storeId: string
  storeName: string
  teacherId: string
  teacherName: string
  danceType: string
  date: string
  startTime: string
  endTime: string
  status: 'booked' | 'cancelled' | 'completed' | 'no_show'
  checkInTime?: string
  cancelTime?: string
  cancelReason?: string
  consumeType: 'free' | 'class_card'
  consumeCardType?: string
  createTime: string
  updateTime: string
}

// 课程卡类型
export interface CourseCard {
  cardId: string
  name: string
  description: string
  danceTypes: string[]
  classCount: number
  price: number
  validityDays: number
  status: 'active' | 'inactive'
  createTime: string
  updateTime: string
}

// 用户课程卡
export interface UserCourseCard {
  userCardId: string
  cardId: string
  cardName: string
  userId: string
  danceType: string
  remainingCount: number
  totalCount: number
  purchaseTime: string
  expireTime: string
  status: 'active' | 'expired' | 'used_up'
}

// 通知类型
export interface Notification {
  notificationId: string
  title: string
  content: string
  type: 'course_change' | 'class_reminder' | 'system' | 'promotion'
  targetUsers: string[] // 目标用户ID列表
  targetType: 'all' | 'users' | 'store' | 'course'
  targetId?: string // 当targetType为store或course时的ID
  sendTime?: string // 定时发送时间
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  sendCount: number // 发送数量
  readCount: number // 阅读数量
  createTime: string
  updateTime: string
}

// 统计数据类型
export interface Statistics {
  period: {
    startDate: string
    endDate: string
    type: 'day' | 'week' | 'month'
  }
  overview: {
    totalBookings: number
    totalUsers: number
    activeUsers: number
    newUsers: number
    totalRevenue: number // 二期使用
  }
  storeStats: Array<{
    storeId: string
    storeName: string
    bookings: number
    users: number
    revenue: number // 二期使用
  }>
  danceTypeStats: Array<{
    danceType: string
    danceTypeName: string
    bookings: number
    percentage: number
  }>
  teacherStats: Array<{
    teacherId: string
    teacherName: string
    bookings: number
    classes: number
    rating: number
  }>
  bookingTrend: Array<{
    date: string
    bookings: number
    users: number
  }>
}

// 预约记录类型
export interface Booking {
  bookingId: string
  courseId: string
  courseName: string
  danceTypeName: string
  teacherId: string
  teacherName: string
  teacherAvatar: string
  storeId: string
  storeName: string
  date: string
  startTime: string
  endTime: string
  status: 'booked' | 'completed' | 'cancelled'
  bookingTime: string
  checkedIn: boolean
  cancelTime?: string
  cancelReason?: string
  evaluation?: {
    rating: number
    content: string
    createTime: string
  }
}

// 管理员类型
export interface Admin {
  adminId: string
  name: string
  phone: string
  avatar?: string
  role: 'super' | 'store' | 'teacher'
  permissions: string[]
  stores: string[] // 可管理的门店列表
  status: 'active' | 'inactive'
  lastLoginTime?: string
  createTime: string
  updateTime: string
}

// 操作日志类型
export interface OperationLog {
  logId: string
  adminId: string
  adminName: string
  operation: string
  target: string
  targetId: string
  details: any
  ip: string
  userAgent: string
  createTime: string
}

// 系统配置类型
export interface SystemConfig {
  configId: string
  key: string
  value: any
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
  createTime: string
  updateTime: string
}

// 分页请求参数类型
export interface PageParams {
  page?: number
  limit?: number
}

// 分页响应类型
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 筛选参数类型
export interface CourseFilterParams {
  storeId?: string
  date?: string
  danceType?: string
  teacherId?: string
  difficulty?: number
  status?: string
}

// 预约状态枚举
export enum BookingStatus {
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

// 课程状态枚举
export enum CourseStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// 用户角色枚举
export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin'
}

// 消耗类型枚举
export enum ConsumeType {
  FREE = 'free',
  CLASS_CARD = 'class_card'
}

// 通知类型枚举
export enum NotificationType {
  COURSE_CHANGE = 'course_change',
  CLASS_REMINDER = 'class_reminder',
  SYSTEM = 'system',
  PROMOTION = 'promotion'
}

// 管理员角色枚举
export enum AdminRole {
  SUPER = 'super',
  STORE = 'store',
  TEACHER = 'teacher'
}