import memoize from 'lodash.memoize';

type UserLocaleOptions = {
  useFallbackLocale?: boolean;
  fallbackLocale?: string;
};

function resolver(options?: UserLocaleOptions): string {
  return JSON.stringify(options);
}

function isString(el: unknown): el is string {
  return typeof el === 'string';
}

function isUnique<T>(el: T, index: number, arr: T[]) {
  return arr.indexOf(el) === index;
}

function isAllLowerCase(el: string) {
  return el.toLowerCase() === el;
}

function normalizeLocale(el: string) {
  if (!el || el.indexOf('-') === -1 || !isAllLowerCase(el)) {
    return el;
  }

  const [splitEl1 = '', splitEl2 = ''] = el.split('-');

  return `${splitEl1}-${splitEl2.toUpperCase()}`;
}

function getUserLocalesInternal({
  useFallbackLocale = true,
  fallbackLocale = 'en-US',
}: UserLocaleOptions = {}): string[] {
  let languageList: string[] = [];

  if (typeof navigator !== 'undefined') {
    languageList = languageList.concat(navigator.languages, navigator.language);
  }

  if (useFallbackLocale) {
    languageList.push(fallbackLocale);
  }

  return languageList.filter(isString).filter(isUnique).map(normalizeLocale);
}

export const getUserLocales = memoize(getUserLocalesInternal, resolver);

function getUserLocaleInternal(options?: undefined): string;
function getUserLocaleInternal(options?: Record<string, never>): string;
function getUserLocaleInternal(options?: {
  useFallbackLocale: false;
  fallbackLocale?: string;
}): string | null;
function getUserLocaleInternal(options?: {
  useFallbackLocale?: true;
  fallbackLocale?: string;
}): string;
function getUserLocaleInternal(options?: UserLocaleOptions): string | null {
  return getUserLocales(options)[0] || null;
}

export const getUserLocale = memoize(getUserLocaleInternal, resolver);

export default getUserLocale;
