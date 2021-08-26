/**
 * lodash.memoize mock is necessary for unit tests to run, as otherwise
 * it would return the first value only.
 * @param {Function} fn Function passed to lodash.memoize
 */
module.exports = (fn) => fn;
