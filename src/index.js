import memoize from 'lodash.memoize';

function resolver(options) {
  return JSON.stringify(options);
}

function uniq(arr) {
  return arr.filter((el, index, self) => self.indexOf(el) === index);
}

function normalizeLocales(arr) {
  return arr.map((el) => {
    if (!el || el.indexOf('-') === -1 || el.toLowerCase() !== el) {
      return el;
    }

    const splitEl = el.split('-');
    return `${splitEl[0]}-${splitEl[1].toUpperCase()}`;
  });
}

function getUserLocalesInternal({ useFallbackLocale = true, fallbackLocale = 'en-US' } = {}) {
  let languageList = [];

  if (typeof window !== 'undefined') {
    const { navigator } = window;

    if (navigator.languages) {
      languageList = languageList.concat(navigator.languages);
    }
    if (navigator.language) {
      languageList.push(navigator.language);
    }
    if (navigator.userLanguage) {
      languageList.push(navigator.userLanguage);
    }
    if (navigator.browserLanguage) {
      languageList.push(navigator.browserLanguage);
    }
    if (navigator.systemLanguage) {
      languageList.push(navigator.systemLanguage);
    }
  }

  if (useFallbackLocale) {
    languageList.push(fallbackLocale);
  }

  return normalizeLocales(uniq(languageList));
}

export const getUserLocales = memoize(getUserLocalesInternal, resolver);

function getUserLocaleInternal(options) {
  return getUserLocales(options)[0] || null;
}

export const getUserLocale = memoize(getUserLocaleInternal, resolver);

export default getUserLocale;
