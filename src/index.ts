import memoize from 'lodash.memoize';

type UserLocaleOptions = {
  useFallbackLocale?: boolean;
  fallbackLocale?: string;
};

function resolver(options?: UserLocaleOptions): string {
  return JSON.stringify(options);
}

function uniqDefined(arr: string[]) {
  return arr.filter((el, index) => el && arr.indexOf(el) === index);
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

  return uniqDefined(languageList).map(normalizeLocale);
}

export const getUserLocales = memoize(getUserLocalesInternal, resolver);

function getUserLocaleInternal(options?: UserLocaleOptions): string | null {
  return getUserLocales(options)[0] || null;
}

export const getUserLocale = memoize(getUserLocaleInternal, resolver);

export default getUserLocale;
