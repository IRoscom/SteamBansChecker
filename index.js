const Menus = require("./core/Menus");
const getConfig = require("./utils/config/getConfig");
const createConfig = require("./utils/config/createConfig");
const logger = require("./utils/logger");
const isValidSteamKey = require("./utils/steam/isValidSteamKey");
(async () => {
  console.clear();
  const menus = new Menus();
  const path = process.argv[2];
  const config = getConfig();
  let steamKey;
  if (!config) {
    steamKey = await menus.getSteamKey();
    createConfig({ steamKey });
  } else {
    if (!isValidSteamKey(config.steamKey)) {
      steamKey = await menus.getSteamKey();
      createConfig({ steamKey });
    }
  }
  menus.config = getConfig();
  if (path) return menus.startChecker(path);
  await menus.openMenu();
})();

process.on("uncaughtException", (error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("👋 Увидемся в следующий раз!");
  } else {
    logger.error(error.message);
    require("./utils/terminal/ExitTerminal");
  }
});
