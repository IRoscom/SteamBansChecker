const { existsSync } = require("fs");
const resolveFilePath = require("./resolveFilePath");

module.exports = (input) => {
  const resolvedPath = resolveFilePath(input);

  if (!existsSync(resolvedPath)) {
    throw new Error(`Файл не найден: ${resolvedPath}`);
  }

  return resolvedPath;
};
