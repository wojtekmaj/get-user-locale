import once from 'lodash.once';

const filterDuplicates = arr => arr.filter((el, index, self) => self.indexOf(el) === index);

const fixLowercaseProperties = arr => arr.map((el) => {
  if (
    !el
    || el.indexOf('-') === -1
    || el.toLowerCase() !== el
  ) {
    return el;
  }

  const splitEl = el.split('-');
  return `${splitEl[0]}-${splitEl[1].toUpperCase()}`;
});

export const getUserLocales = once(() => {
  const languageList = [];

  if (typeof window !== 'undefined') {
    if (window.navigator.languages) {
      languageList.push(...window.navigator.languages);
    }
    if (window.navigator.language) {
      languageList.push(window.navigator.language);
    }
    if (window.navigator.userLanguage) {
      languageList.push(window.navigator.userLanguage);
    }
    if (window.navigator.browserLanguage) {
      languageList.push(window.navigator.browserLanguage);
    }
    if (window.navigator.systemLanguage) {
      languageList.push(window.navigator.systemLanguage);
    }
  }

  languageList.push('en-US'); // Fallback

  return fixLowercaseProperties(filterDuplicates(languageList));
});

export const getUserLocale = once(() => getUserLocales()[0]);

export default getUserLocale;
