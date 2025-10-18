// Type declarations for api.js module
import type { ApiResponse, UserInfo, Store, Course, Teacher, Booking, Notification, Statistics, Admin } from './types';

export declare const get: <T = any>(url: string, params?: any, options?: any) => Promise<T>;
export declare const post: <T = any>(url: string, data?: any, options?: any) => Promise<T>;
export declare const put: <T = any>(url: string, data?: any, options?: any) => Promise<T>;
export declare const del: <T = any>(url: string, options?: any) => Promise<T>;
export declare const uploadFile: (filePath: string, url: string, formData?: any) => Promise<any>;

export declare const userApi: {
  login: (phone: string, code: string) => Promise<any>;
  getUserInfo: () => Promise<UserInfo>;
  updateUserInfo: (data: any) => Promise<any>;
  getUserBookings: (page?: number, limit?: number, status?: string) => Promise<any>;
  getUserCourseCards: () => Promise<any>;
  generateEntranceCode: () => Promise<any>;
  logout: () => Promise<any>;
};

export declare const storeApi: {
  getStores: () => Promise<Store[]>;
  getStoreDetail: (id: string) => Promise<Store>;
};

export declare const courseApi: {
  getCourses: (params?: any) => Promise<any>;
  getCourseDetail: (id: string) => Promise<Course>;
  bookCourse: (courseId: string) => Promise<any>;
  cancelBooking: (bookingId: string) => Promise<any>;
  checkIn: (bookingId: string) => Promise<any>;
  getUserCourses: (page?: number, limit?: number) => Promise<any>;
};

export declare const teacherApi: {
  getTeachers: (params?: any) => Promise<any>;
  getTeacherDetail: (id: string) => Promise<Teacher>;
};

export declare const adminApi: {
  adminLogin: (phone: string, code: string) => Promise<any>;
  getAdminInfo: () => Promise<Admin>;
  getStatistics: (params?: any) => Promise<Statistics>;
  getSystemConfig: () => Promise<any>;
  updateSystemConfig: (config: any) => Promise<any>;
};

export declare const bookingApi: {
  getBookings: (params?: any) => Promise<any>;
  getBookingDetail: (id: string) => Promise<Booking>;
  updateBookingStatus: (id: string, status: string) => Promise<any>;
  getBookingStats: () => Promise<any>;
};

export declare const notificationApi: {
  getNotifications: (page?: number, limit?: number) => Promise<any>;
  getNotificationDetail: (id: string) => Promise<Notification>;
  createNotification: (data: any) => Promise<any>;
  updateNotification: (id: string, data: any) => Promise<any>;
  deleteNotification: (id: string) => Promise<any>;
};