const { windows } = require("../../models/RegExp");
/**
 *
 * @param {String} filename
 * @returns {String}
 */
module.exports = (filename) => {
  if (windows.invalidChars.test(filename)) return false;
  if (windows.reservedNames.test(filename)) return false;
  if (!filename || filename.length > 255) return false;
  return true;
};
