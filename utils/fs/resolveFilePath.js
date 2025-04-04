const { isAbsolute, join, dirname } = require("path");

/**
 * @param {String} input
 * @returns {String}
 */
module.exports = (input) => {
  input = input.replace(/"/g, "");
  if (isAbsolute(input)) {
    return input;
  } else {
    return join(dirname(process.execPath), input);
  }
};
