require("colors");
module.exports = {
  /**
   * @param  {...any} message
   */
  info(message) {
    console.info(`[info]`.toUpperCase().blue, message);
  },
  /**
   * @param  {...any} message
   */
  error(message) {
    console.error(`[error]`.toUpperCase().red, message);
  },
  /**
   * @param  {...any} message
   */
  warn(message) {
    console.warn(`[warning]`.toUpperCase().yellow, message);
  },
};
