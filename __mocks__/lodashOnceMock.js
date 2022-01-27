/**
 * lodash.once mock is necessary for unit tests to run, as otherwise
 * it would return the first value only.
 * @param {Function} fn Function passed to lodash.once
 */
module.exports = (fn) => fn;
