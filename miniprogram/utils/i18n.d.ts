// Type declarations for i18n module
declare module 'i18n.js' {
  interface I18nInstance {
    setLanguage(language: string): boolean;
    getLanguage(): string;
    t(key: string, params?: Record<string, any>): string;
    getSupportedLanguages(): string[];
  }

  const i18n: I18nInstance;
  export default i18n;
}