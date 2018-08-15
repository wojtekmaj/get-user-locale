# Get-User-Locale
A function that returns a [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag), based on all available sources.

## tl;dr
* Install by executing `npm install get-user-locale` or `yarn add get-user-locale`.
* Import by adding `import getUserLocale from 'get-user-locale`.
* Do stuff with it!
    ```js
    const userLocale = getUserLocale();
    ```

## User guide

### getUserLocale()

A function that returns a [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag), based on all available sources.

#### Sample result

```js
'de-DE'
```

#### Usage

```js
import getUserLocale from 'get-user-locale';
```

or

```js
import { getUserLocale } from 'get-user-locale';
```

### getUserLocales()

A function that returns an array of [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag)s, based on all available sources.

#### Sample result

```js
['de-DE', 'de', 'en-US', 'en']
```

#### Usage

```js
import { getUserLocales } from 'get-user-locale';
```

## Technical details

There are at least five ways of determining user's locale:

* `window.navigator.languages`
* `window.navigator.language`
* `window.navigator.userLanguage`
* `window.navigator.browserLanguage`
* `window.navigator.systemLanguage`

`...languages` is an array of strings, the others are strings. Some browsers return mixed-case [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (e.g. `de-DE`), while others return lowercase ones (e.g. `de-de`). Finally, non-browser environments will not return anything, so you need a fallback.

Get-User-Locale does the following:
* Combines all of them into one sane set of locales - in that particular order,
* Dedupes them,
* Fixes invalid, lowercased [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag) (so that the part after `-` is always uppercased),
* Adds a fallback to `en-US`, so if all else fails, you will get a result that won't crash your app.

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
      <a href="http://wojtekmaj.pl">http://wojtekmaj.pl</a>
    </td>
  </tr>
</table>
