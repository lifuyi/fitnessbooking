// Type declarations for util.js module
export declare const formatTime: (date: Date | number | string, format?: string) => string;
export declare const formatRelativeTime: (date: Date | number | string) => string;
export declare const debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => T;
export declare const throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => T;
export declare const showToast: (title: string, icon?: 'success' | 'loading' | 'error' | 'none', duration?: number) => void;
export declare const showLoading: (title?: string) => void;
export declare const hideLoading: () => void;
export declare const showModal: (title: string, content: string, showCancel?: boolean) => Promise<boolean>;
export declare const showActionSheet: (itemList: string[]) => Promise<number>;
export declare const getCurrentUser: () => any;
export declare const checkLogin: () => boolean;
export declare const navigateToLogin: () => void;
export declare const generateRandomString: (length?: number) => string;
export declare const deepClone: <T>(obj: T) => T;
export declare const maskPhone: (phone: string) => string;
export declare const isToday: (date: Date | number | string) => boolean;
export declare const isTomorrow: (date: Date | number | string) => boolean;