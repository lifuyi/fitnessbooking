// Type declarations for util module
declare module '../../../utils/util' {
  export const formatTime: (date: Date | number | string, format?: string) => string;
  export const formatRelativeTime: (date: Date | number | string) => string;
  export const debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => T;
  export const throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => T;
  export const showToast: (title: string, icon?: 'success' | 'loading' | 'error' | 'none', duration?: number) => void;
  export const showLoading: (title?: string) => void;
  export const hideLoading: () => void;
  export const showModal: (title: string, content: string, showCancel?: boolean) => Promise<boolean>;
  export const showActionSheet: (itemList: string[]) => Promise<number>;
  export const getCurrentUser: () => any;
  export const checkLogin: () => boolean;
  export const navigateToLogin: () => void;
  export const generateRandomString: (length?: number) => string;
  export const deepClone: <T>(obj: T) => T;
  export const maskPhone: (phone: string) => string;
  export const isToday: (date: Date | number | string) => boolean;
  export const isTomorrow: (date: Date | number | string) => boolean;
}