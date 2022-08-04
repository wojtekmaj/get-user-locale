declare module 'get-user-locale' {
  export type UserLocaleOptions = {
    fallbackLocale?: string,
    useFallbackLocale?: boolean,
  }
  export function getUserLocale(options?: UserLocaleOptions): string;
  export function getUserLocales(options?: UserLocaleOptions): string[];
  export default getUserLocale;
}
