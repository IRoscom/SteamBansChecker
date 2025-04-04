const { writeFileSync } = require("fs");
const { join, dirname } = require("path");

/**
 * @param {Object} options
 * @returns {void}
 */
module.exports = async (options) => {
  const config = {
    steamKey: null,
    filename: "результаты",
  };
  return writeFileSync(
    join(dirname(process.execPath), "config.json"),
    JSON.stringify(Object.assign(config, options), null, 2)
  );
};
