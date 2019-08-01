import once from 'lodash.once';

function filterDuplicates(arr) {
  return arr.filter((el, index, self) => self.indexOf(el) === index);
}

function fixLowercaseProperties(arr) {
  return arr.map((el) => {
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
}

function getUserLocalesInternal() {
  let languageList = [];

  if (typeof window !== 'undefined') {
    if (window.navigator.languages) {
      languageList = languageList.concat(window.navigator.languages);
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
}

export const getUserLocales = once(getUserLocalesInternal);

function getUserLocaleInternal() {
  return getUserLocales()[0];
}

export const getUserLocale = once(getUserLocaleInternal);

export default getUserLocale;
