module.exports = require("readline")
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  .question("Нажмите Enter для выхода...", () => process.exit(1));
