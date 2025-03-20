import memoize from 'memoize';

type UserLocaleOptions = {
  useFallbackLocale?: boolean;
  fallbackLocale?: string;
};

function isString(el: unknown): el is string {
  return typeof el === 'string';
}

function isUnique<T>(el: T, index: number, arr: T[]): boolean {
  return arr.indexOf(el) === index;
}

function isAllLowerCase(el: string): boolean {
  return el.toLowerCase() === el;
}

function fixCommas(el: string): string | string[] {
  return el.indexOf(',') === -1 ? el : el.split(',');
}

function normalizeLocale(locale: string): string {
  if (!locale) {
    return locale;
  }

  if (locale === 'C' || locale === 'posix' || locale === 'POSIX') {
    return 'en-US';
  }

  // If there's a dot (.) in the locale, it's likely in the format of "en-US.UTF-8", so we only take the first part
  if (locale.indexOf('.') !== -1) {
    const [actualLocale = ''] = locale.split('.');

    return normalizeLocale(actualLocale);
  }

  // If there's an at sign (@) in the locale, it's likely in the format of "en-US@posix", so we only take the first part
  if (locale.indexOf('@') !== -1) {
    const [actualLocale = ''] = locale.split('@');

    return normalizeLocale(actualLocale);
  }

  // If there's a dash (-) in the locale and it's not all lower case, it's already in the format of "en-US", so we return it
  if (locale.indexOf('-') === -1 || !isAllLowerCase(locale)) {
    return locale;
  }

  const [splitEl1, splitEl2 = ''] = locale.split('-');

  return `${splitEl1}-${splitEl2.toUpperCase()}`;
}

function getUserLocalesInternal({
  useFallbackLocale = true,
  fallbackLocale = 'en-US',
}: UserLocaleOptions = {}): string[] {
  let languageList: string[] = [];

  if (typeof navigator !== 'undefined') {
    const rawLanguages = navigator.languages || [];
    let languages: string[] = [];
    for (const rawLanguagesItem of rawLanguages) {
      languages = languages.concat(fixCommas(rawLanguagesItem));
    }

    const rawLanguage = navigator.language;
    const language = rawLanguage ? fixCommas(rawLanguage) : rawLanguage;

    languageList = languageList.concat(languages, language);
  }

  if (useFallbackLocale) {
    languageList.push(fallbackLocale);
  }

  return languageList.filter(isString).map(normalizeLocale).filter(isUnique);
}

export const getUserLocales: (
  options?:
    | {
        useFallbackLocale?: boolean;
        fallbackLocale?: string;
      }
    | undefined,
) => string[] = memoize(getUserLocalesInternal, { cacheKey: JSON.stringify });

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

export const getUserLocale: {
  (options?: undefined): string;
  (options?: Record<string, never>): string;
  (options?: {
    useFallbackLocale: false;
    fallbackLocale?: string;
  }): string | null;
  (options?: {
    useFallbackLocale?: true;
    fallbackLocale?: string;
  }): string;
} = memoize(getUserLocaleInternal, { cacheKey: JSON.stringify });

export default getUserLocale;
