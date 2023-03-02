import { describe, expect, it, vi } from 'vitest';
import getUserLocaleDefault, { getUserLocale, getUserLocales } from './index';

let mockNavigatorObject: object;

/**
 * Because unlike in the real browser navigator object will change, we need to add mock navigator
 * object to lodash.memoize resolver function.
 */

vi.mock('lodash.memoize', async () => {
  const { default: actualMemoize } = await vi.importActual<{
    default: typeof import('lodash.memoize');
  }>('lodash.memoize');

  return {
    default: vi.fn().mockImplementation((fn, resolver) => {
      function navigatorResolver(args: unknown) {
        return JSON.stringify(mockNavigatorObject) + resolver(args);
      }

      return actualMemoize(fn, navigatorResolver);
    }),
  };
});

const navigatorLanguageProperties: (keyof Navigator)[] = ['language', 'languages'];

function mockNavigator(mockNavigatorProperties: { [key in keyof Navigator]?: Navigator[key] }) {
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
