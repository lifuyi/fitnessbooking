// Type declarations for api module
declare module '../../../utils/api' {
  export const get: <T = any>(url: string, params?: any, options?: any) => Promise<T>;
  export const post: <T = any>(url: string, data?: any, options?: any) => Promise<T>;
  export const put: <T = any>(url: string, data?: any, options?: any) => Promise<T>;
  export const del: <T = any>(url: string, options?: any) => Promise<T>;
  export const uploadFile: (filePath: string, url: string, formData?: any) => Promise<any>;

  export const userApi: {
    login: (phone: string, code: string) => Promise<any>;
    getUserInfo: () => Promise<any>;
    updateUserInfo: (data: any) => Promise<any>;
    getUserBookings: (page?: number, limit?: number, status?: string) => Promise<any>;
    getUserCourseCards: () => Promise<any>;
    generateEntranceCode: () => Promise<any>;
    logout: () => Promise<any>;
  };

  export const storeApi: {
    getStores: () => Promise<any>;
    getStoreDetail: (id: string) => Promise<any>;
  };

  export const courseApi: {
    getCourses: (params?: any) => Promise<any>;
    getCourseDetail: (id: string) => Promise<any>;
    bookCourse: (courseId: string) => Promise<any>;
    cancelBooking: (bookingId: string) => Promise<any>;
    checkIn: (bookingId: string) => Promise<any>;
    getUserCourses: (page?: number, limit?: number) => Promise<any>;
  };

  export const teacherApi: {
    getTeachers: (params?: any) => Promise<any>;
    getTeacherDetail: (id: string) => Promise<any>;
  };

  export const adminApi: {
    adminLogin: (phone: string, code: string) => Promise<any>;
    getAdminInfo: () => Promise<any>;
    getStatistics: (params?: any) => Promise<any>;
    getSystemConfig: () => Promise<any>;
    updateSystemConfig: (config: any) => Promise<any>;
  };

  export const bookingApi: {
    getBookings: (params?: any) => Promise<any>;
    getBookingDetail: (id: string) => Promise<any>;
    updateBookingStatus: (id: string, status: string) => Promise<any>;
    getBookingStats: () => Promise<any>;
  };

  export const notificationApi: {
    getNotifications: (page?: number, limit?: number) => Promise<any>;
    getNotificationDetail: (id: string) => Promise<any>;
    createNotification: (data: any) => Promise<any>;
    updateNotification: (id: string, data: any) => Promise<any>;
    deleteNotification: (id: string) => Promise<any>;
  };
}