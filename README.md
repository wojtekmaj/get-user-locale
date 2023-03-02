[![npm](https://img.shields.io/npm/v/get-user-locale.svg)](https://www.npmjs.com/package/get-user-locale) ![downloads](https://img.shields.io/npm/dt/get-user-locale.svg) [![CI](https://github.com/wojtekmaj/get-user-locale/workflows/CI/badge.svg)](https://github.com/wojtekmaj/get-user-locale/actions)

# Get-User-Locale

A function that returns user's locale as an [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag), based on all available sources.

## tl;dr

- Install by executing `npm install get-user-locale` or `yarn add get-user-locale`.
- Import by adding `import getUserLocale from 'get-user-locale'`.
- Do stuff with it!
  ```js
  const userLocale = getUserLocale();
  ```

## User guide

### `getUserLocale()`

A function that returns user's preferred locale as an [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag), based on all available sources.

#### Sample result

```js
'de-DE';
```

#### Usage

```js
import getUserLocale from 'get-user-locale';
```

or

```js
import { getUserLocale } from 'get-user-locale';
```

##### Options

`getUserLocale()` may be called with an optional `options` argument.

`options` object may contain the following properties:

| Property            | Description                         | Default value |
| ------------------- | ----------------------------------- | ------------- |
| `fallbackLocale`    | A locale to use as a fallback.      | `en-US`       |
| `useFallbackLocale` | Whether to use the fallback locale. | `true`        |

### `getUserLocales()`

A function that returns an array of user's preferred locales as an [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag), based on all available sources.

#### Sample result

```js
['de-DE', 'de', 'en-US', 'en'];
```

#### Usage

```js
import { getUserLocales } from 'get-user-locale';
```

##### Options

`getUserLocales()` may be called with an optional `options` argument.

`options` object may contain the following properties:

| Property            | Description                         | Default value |
| ------------------- | ----------------------------------- | ------------- |
| `fallbackLocale`    | A locale to use as a fallback.      | `en-US`       |
| `useFallbackLocale` | Whether to use the fallback locale. | `true`        |

## Technical details

There are a few ways of determining user's locale:

- `window.navigator.languages`
- `window.navigator.language`

`…languages` is an array of strings, `…language` is a string. Some browsers return mixed-case [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g. `de-DE`), while others return lowercase ones (e.g. `de-de`). Finally, non-browser environments will not return anything, so you need a fallback.

Get-User-Locale does the following:

- Combines all of them into one sane set of locales - in that particular order,
- Dedupes them,
- Fixes invalid, lowercased [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (so that the part after `-` is always uppercased),
- Adds a fallback to `en-US`, so if all else fails, you will get a result that won't crash your app.

## License

The MIT License.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/wojtekmaj.png?s=100" width="100">
    </td>
    <td>
      Wojciech Maj<br />
      <a href="mailto:kontakt@wojtekmaj.pl">kontakt@wojtekmaj.pl</a><br />
      <a href="https://wojtekmaj.pl">https://wojtekmaj.pl</a>
    </td>
  </tr>
</table>
