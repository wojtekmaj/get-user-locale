import getUserLocaleDefault, {
  getUserLocale,
  getUserLocales,
} from '../entry';

const navigatorLanguageProperties = ['language', 'languages', 'userLanguage', 'browserLanguage', 'systemLanguage'];

const mockNavigator = (navigator) => {
  navigatorLanguageProperties.forEach(property => Object.defineProperty(
    window.navigator,
    property,
    { value: navigator[property], configurable: true },
  ));
};

it('exports getUserLocale by default', () => {
  expect(getUserLocaleDefault).toBe(getUserLocale);
});

describe('getUserLocale', () => {
  it('returns valid list for Chrome', () => {
    const navigator = {
      language: 'pl',
      languages: ['pl', 'en-US', 'en', 'pl-PL'],
    };

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('pl');
  });

  it('returns valid list for Firefox', () => {
    const navigator = {
      language: 'pl',
      languages: ['pl', 'en-US', 'en'],
    };

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('pl');
  });

  it('returns valid list for IE 9-10', () => {
    const navigator = {
      userLanguage: 'pl-PL',
      browserLanguage: 'pl-PL',
      systemLanguage: 'pl-PL',
    };

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('pl-PL');
  });

  it('returns valid list for IE 11', () => {
    const navigator = {
      language: 'pl-PL',
      userLanguage: 'pl-PL',
      browserLanguage: 'pl-PL',
      systemLanguage: 'pl-PL',
    };

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('pl-PL');
  });

  it('returns valid list for Safari 9', () => {
    const navigator = {
      language: 'pl-pl', // note the lowercase
    };

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('pl-PL');
  });

  it('returns valid list for Safari 10', () => {
    const navigator = {
      language: 'pl-PL',
      languages: ['pl-PL', 'pl', 'en-US', 'en'],
    };

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('pl-PL');
  });

  it('returns when no navigator properties are given', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('en-US');
  });
});

describe('getUserLocales', () => {
  it('returns valid list for Chrome', () => {
    const navigator = {
      language: 'pl',
      languages: ['pl', 'en-US', 'en', 'pl-PL'],
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['pl', 'en-US', 'en', 'pl-PL']);
  });

  it('returns valid list for Firefox', () => {
    const navigator = {
      language: 'pl',
      languages: ['pl', 'en-US', 'en'],
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['pl', 'en-US', 'en']);
  });

  it('returns valid list for IE 9-10', () => {
    const navigator = {
      userLanguage: 'pl-PL',
      browserLanguage: 'pl-PL',
      systemLanguage: 'pl-PL',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['pl-PL', 'en-US']);
  });

  it('returns valid list for IE 11', () => {
    const navigator = {
      language: 'pl-PL',
      userLanguage: 'pl-PL',
      browserLanguage: 'pl-PL',
      systemLanguage: 'pl-PL',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['pl-PL', 'en-US']);
  });

  it('returns valid list for Safari 9', () => {
    const navigator = {
      language: 'pl-pl', // note the lowercase
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['pl-PL', 'en-US']);
  });

  it('returns valid list for Safari 10', () => {
    const navigator = {
      language: 'pl-PL',
      languages: ['pl-PL', 'pl', 'en-US', 'en'],
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['pl-PL', 'pl', 'en-US', 'en']);
  });

  it('returns when no navigator properties are given', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });
});
