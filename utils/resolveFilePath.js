const { isAbsolute, join } = require("path");

/**
 * @param {String} input
 * @returns {String}
 */
module.exports = (input) => {
  input = input.replace(/"/g, "");
  if (isAbsolute(input)) {
    return input;
  } else {
    return join(process.cwd(), input);
  }
};
