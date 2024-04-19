import { describe, expect, it, vi } from 'vitest';

import getUserLocaleDefault, { getUserLocale, getUserLocales } from './index.js';

let mockNavigatorObject: object;

/**
 * Because unlike in the real browser navigator object will change, we need to add mock navigator
 * object to mem cacheKey function.
 */

vi.mock('mem', async () => {
  const { default: actualMem } = await vi.importActual<{
    default: typeof import('mem');
  }>('mem');

  return {
    default: vi.fn().mockImplementation((fn, options) => {
      function cacheKeyWithNavigator(args: unknown) {
        return JSON.stringify(mockNavigatorObject) + options.cacheKey(args);
      }

      return actualMem(fn, { cacheKey: cacheKeyWithNavigator });
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
