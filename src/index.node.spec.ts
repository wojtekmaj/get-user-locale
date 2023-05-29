/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';

import getUserLocaleDefault, { getUserLocale, getUserLocales } from './index.js';

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

  it('returns default fallback locale when no navigator properties are given and getUserLocale is called with useFallbackLocale = true option', () => {
    expect(getUserLocale({ useFallbackLocale: true })).toEqual('en-US');
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocale is called with fallbackLocale option', () => {
    expect(getUserLocale({ fallbackLocale: 'de-DE' })).toEqual('de-DE');
  });

  it('returns custom fallback locale when no navigator properties are given and getUserLocale is called with fallbackLocale and useFallbackLocale = true options', () => {
    expect(getUserLocale({ fallbackLocale: 'de-DE', useFallbackLocale: true })).toEqual('de-DE');
  });

  it('returns null when no navigator properties are given and getUserLocale is called with useFallbackLocale = false option', () => {
    expect(getUserLocale({ useFallbackLocale: false })).toEqual(null);
  });

  it('returns null when no navigator properties are given and getUserLocale is called with fallbackLocale and useFallbackLocale = false options', () => {
    expect(getUserLocale({ fallbackLocale: 'de-DE', useFallbackLocale: false })).toEqual(null);
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
