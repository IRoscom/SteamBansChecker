const { input } = require("@inquirer/prompts");
const { writeFileSync } = require("fs");
const { join } = require("path");
const isValidSteamKey = require("./isValidSteamKey");

module.exports = async () => {
  const steamKey = await input({
    message:
      "Введите ключ веб-API Steam (https://steamcommunity.com/dev/apikey):",
  });
  if (!isValidSteamKey(steamKey))
    throw new Error("ключ веб-API Steam неверный.");
  writeFileSync(
    join(process.cwd(), "config.json"),
    JSON.stringify({ steamKey })
  );
};
