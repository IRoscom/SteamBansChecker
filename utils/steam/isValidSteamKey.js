const { steamKey } = require("../../models/RegExp");

/**
 *
 * @param {String} key
 * @returns {Boolean}
 */
module.exports = (key) => {
  return steamKey.test(key);
};
