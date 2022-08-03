/**
 * @jest-environment node
 */
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

it('exports getUserLocale() by default', () => {
  expect(getUserLocaleDefault).toBeDefined();
  expect(getUserLocaleDefault).toBe(getUserLocale);
});

describe('getUserLocale()', () => {
  it('returns default fallback locale when no navigator properties are given', () => {
    expect(getUserLocale()).toEqual('en-US');
  });

  it('returns default fallback locale when no navigator properties are given and getUserLocale is called with empty options', () => {
    expect(getUserLocale({})).toEqual('en-US');
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocale is called with fallbackLocale option', () => {
    expect(getUserLocale({ fallbackLocale: 'de-DE' })).toEqual('de-DE');
  });

  it('returns null when no navigator properties are given and getUserLocale is called with useFallbackLocale = false option', () => {
    expect(getUserLocale({ useFallbackLocale: false })).toEqual(null);
  });
});

describe('getUserLocales()', () => {
  it('returns default fallback locale when no navigator properties are given', () => {
    expect(getUserLocales()).toEqual(['en-US']);
  });

  it('returns default fallback locale when no navigator properties are given and getUserLocales is called with empty options', () => {
    expect(getUserLocales({})).toEqual(['en-US']);
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocales is called with fallbackLocale option', () => {
    expect(getUserLocales({ fallbackLocale: 'de-DE' })).toEqual(['de-DE']);
  });

  it('returns empty array when no navigator properties are given and getUserLocales is called with useFallbackLocale = false option', () => {
    expect(getUserLocales({ useFallbackLocale: false })).toEqual([]);
  });
});
