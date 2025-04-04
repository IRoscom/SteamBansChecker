const { join, dirname } = require("path");
const getConfig = require("./getConfig");
const { writeFileSync } = require("fs");

/**
 * @param {Object} options
 * @returns {void}
 */
module.exports = (options) => {
  const config = getConfig();
  return writeFileSync(
    join(dirname(process.execPath), "config.json"),
    JSON.stringify(Object.assign(config, options), null, 2)
  );
};
