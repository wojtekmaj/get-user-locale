import getUserLocaleDefault, { getUserLocale, getUserLocales } from './index';

let mockNavigatorObject = null;

/**
 * Because unlike in the real browser navigator object will change, we need to add mock navigator
 * object to lodash.memoize resolver function.
 */
jest.mock('lodash.memoize', () =>
  jest.fn().mockImplementation((fn, resolver) => {
    const actualMemoize = jest.requireActual('lodash.memoize');

    function navigatorResolver(args) {
      return JSON.stringify(mockNavigatorObject) + resolver(args);
    }

    return actualMemoize(fn, navigatorResolver);
  }),
);

const navigatorLanguageProperties = [
  'language',
  'languages',
  'userLanguage',
  'browserLanguage',
  'systemLanguage',
];

function mockNavigator(mockNavigatorProperties) {
  navigatorLanguageProperties.forEach((property) =>
    Object.defineProperty(window.navigator, property, {
      value: mockNavigatorProperties[property],
      configurable: true,
    }),
  );
  mockNavigatorObject = mockNavigatorProperties;
}

it('exports getUserLocale() by default', () => {
  expect(getUserLocaleDefault).toBeDefined();
  expect(getUserLocaleDefault).toBe(getUserLocale);
});

describe('getUserLocale()', () => {
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

  it('returns default fallback locale when no navigator properties are given', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual('en-US');
  });

  it('returns default fallback locale when no navigator properties are given and getUserLocale is called with empty options', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({})).toEqual('en-US');
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocale is called with fallbackLocale option', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({ fallbackLocale: 'de-DE' })).toEqual('de-DE');
  });

  it('returns null when no navigator properties are given and getUserLocale is called with useFallbackLocale = false option', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({ useFallbackLocale: false })).toEqual(null);
  });
});

describe('getUserLocales()', () => {
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

  it('returns default fallback locale when no navigator properties are given', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });

  it('returns default fallback locale when no navigator properties are given and getUserLocales is called with empty options', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocales({})).toEqual(['en-US']);
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocales is called with fallbackLocale option', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocales({ fallbackLocale: 'de-DE' })).toEqual(['de-DE']);
  });

  it('returns empty array when no navigator properties are given and getUserLocales is called with useFallbackLocale = false option', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocales({ useFallbackLocale: false })).toEqual([]);
  });
});
