import { describe, expect, it, vi } from 'vitest';

import getUserLocaleDefault, { getUserLocale, getUserLocales } from './index.js';

let mockNavigatorObject: object;

/**
 * Because unlike in the real browser navigator object will change, we need to add mock navigator
 * object to mem cacheKey function.
 */

vi.mock('memoize', async () => {
  const { default: actualMemoize } = await vi.importActual<typeof import('memoize')>('memoize');

  return {
    default: vi.fn().mockImplementation((fn, options) => {
      function cacheKeyWithNavigator(args: unknown) {
        return JSON.stringify(mockNavigatorObject) + options.cacheKey(args);
      }

      return actualMemoize(fn, { cacheKey: cacheKeyWithNavigator });
    }),
  };
});

const navigatorLanguageProperties: (keyof Navigator)[] = ['language', 'languages'];

function mockNavigator(mockNavigatorProperties: { [key in keyof Navigator]?: Navigator[key] }) {
  for (const property of navigatorLanguageProperties) {
    Object.defineProperty(window.navigator, property, {
      value: mockNavigatorProperties[property],
      configurable: true,
    });
  }

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
      potato: true,
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

  it.each`
    locale                  | expectedLocale
    ${'zh-hant-tw'}         | ${'zh-Hant-TW'}
    ${'sr-latn'}            | ${'sr-Latn'}
    ${'sl-rozaj-biske'}     | ${'sl-biske-rozaj'}
    ${'en-us-u-ca-gregory'} | ${'en-US-u-ca-gregory'}
    ${'en-us-x-private'}    | ${'en-US-x-private'}
    ${'ja-u'}               | ${'ja-u'}
  `('normalizes $locale to $expectedLocale', ({ locale, expectedLocale }) => {
    const navigator = {
      language: locale,
    };

    mockNavigator(navigator);

    expect(getUserLocale()).toEqual(expectedLocale);
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

  it('returns default fallback locale when no navigator properties are given and getUserLocale is called with useFallbackLocale = true option', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({ useFallbackLocale: true })).toEqual('en-US');
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocale is called with fallbackLocale option', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({ fallbackLocale: 'de-DE' })).toEqual('de-DE');
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocale is called with fallbackLocale and useFallbackLocale = true options', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({ fallbackLocale: 'de-DE', useFallbackLocale: true })).toEqual('de-DE');
  });

  it('returns null when no navigator properties are given and getUserLocale is called with useFallbackLocale = false option', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({ useFallbackLocale: false })).toEqual(null);
  });

  it('returns null when no navigator properties are given and getUserLocale is called with fallbackLocale and useFallbackLocale = false options', () => {
    const navigator = {};

    mockNavigator(navigator);

    expect(getUserLocale({ fallbackLocale: 'de-DE', useFallbackLocale: false })).toEqual(null);
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

  it('preserves distinct locales and extensions when normalizing lowercase locales', () => {
    const navigator = {
      language: 'zh-hant-tw',
      languages: ['zh-hant-tw', 'zh-hant-hk', 'sr-latn-rs', 'ja-u-ca-japanese'],
    };

    mockNavigator(navigator);

    const locales = getUserLocales();

    expect(locales).toEqual([
      'zh-Hant-TW',
      'zh-Hant-HK',
      'sr-Latn-RS',
      'ja-u-ca-japanese',
      'en-US',
    ]);
    expect(() => new Intl.DateTimeFormat(locales[3])).not.toThrow();
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

  it('handles invalid navigator properties', () => {
    const navigator = {
      language: 'en-US,en',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US', 'en']);
  });

  it('handles POSIX locales (1)', () => {
    const navigator = {
      language: 'C',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });

  it('handles POSIX locales (2)', () => {
    const navigator = {
      language: 'C.UTF-8',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });

  it('handles POSIX locales (3)', () => {
    const navigator = {
      language: 'en-US.UTF-8',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });

  it('handles POSIX locales (3)', () => {
    const navigator = {
      language: 'en-US.UTF-8',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });

  it('handles POSIX locales (4)', () => {
    const navigator = {
      language: 'en-US@posix',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });

  it('handles POSIX locales (5)', () => {
    const navigator = {
      language: 'posix',
    };

    mockNavigator(navigator);

    expect(getUserLocales()).toEqual(['en-US']);
  });
});
