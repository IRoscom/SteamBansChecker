const { steamKey } = require("./RegExp");

module.exports = (key) => {
  return steamKey.test(key);
};
