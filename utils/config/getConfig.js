const { readFileSync, existsSync } = require("fs");
const { join, dirname } = require("path");

/**
 * @typedef {Object} Options
 * @property {String} steamKey
 * @property {String} filename
 * @returns {Options}
 */
module.exports = () => {
  const path = join(dirname(process.execPath), "config.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8"));
};
