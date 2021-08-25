import memoize from 'lodash.memoize';

export const defaultOptions = {
  fallbackLocale: 'en-US',
  useFallbackLocale: true,
};

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

function optionResolver(options) {
  return JSON.stringify({ ...defaultOptions, ...options})
}

function getUserLocalesInternal(options = {}) {
  const _options = { ...defaultOptions, ...options}
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

  if (_options.useFallbackLocale) {
    languageList.push(_options.fallbackLocale); // Fallback
  }

  return normalizeLocales(uniq(languageList));
}

export const getUserLocales = memoize(getUserLocalesInternal, optionResolver);

function getUserLocaleInternal(options = {}) {
  return getUserLocales(options)[0] || null;
}

export const getUserLocale = memoize(getUserLocaleInternal, optionResolver);

export default getUserLocale;
