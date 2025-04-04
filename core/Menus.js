const inquirer = require("inquirer");
const isValidSteamKey = require("../utils/steam/isValidSteamKey");
const pluralize = require("../utils/pluralize");
const { join } = require("path");
const progressBar = require("../utils/terminal/ProgressBar");
const { readFileSync, writeFileSync } = require("fs");
const { urlPattern } = require("../models/RegExp");
const Steam = require("./Steam");
const logger = require("../utils/logger");
const updateConfig = require("../utils/config/updateConfig");
const isValidWindowsFilename = require("../utils/fs/isValidWindowsFilename");

module.exports = class Menus {
  constructor(config) {
    this.config = config;
  }
  async openMenu() {
    console.clear();
    const { action } = await inquirer.default.prompt([
      {
        type: "select",
        name: "action",
        message: "Выберите действие",
        choices: [
          { name: "Запустить чекер", value: "startChecker" },
          { name: "Настройки", value: "settings" },
        ],
      },
    ]);

    return this[action]();
  }

  async settings() {
    console.clear();
    const { action } = await inquirer.default.prompt([
      {
        type: "select",
        name: "action",
        message: "Выберите действие",
        choices: [
          { name: "Сменить steam ключ", value: "changeSteamKey" },
          { name: "Сменить имя файла результатов", value: "changeFilename" },
          { name: "Назад", value: "back" },
        ],
      },
    ]);

    return this[action]();
  }

  async startChecker(path) {
    console.clear();
    if (!path) {
      const { pathFile } = await inquirer.default.prompt([
        {
          type: "input",
          name: "pathFile",
          message: "Введите имя/путь к файлу: ",
        },
      ]);
      path = pathFile;
    }
    const pathFile = require("../utils/fs/getValidFilePath")(path);
    if (!pathFile.endsWith(".txt"))
      throw new Error("Этот файл не в формате .txt");
    const steam = new Steam(this.config.steamKey);
    let accounts = readFileSync(pathFile, "utf-8");
    accounts = accounts.match(urlPattern);
    if (!accounts.length)
      throw new Error("В файле отсутствуют ссылки на профили");
    progressBar.steamIdResolver.start(accounts.length, 0);
    let accountsSteamIds = Array();
    for (const account of accounts) {
      const steamId = await require("../utils/steam/getSteamIdFromUrl")(
        account,
        steam
      );
      if (steamId) accountsSteamIds.push(steamId);
      progressBar.steamIdResolver.increment();
    }
    progressBar.steamIdResolver.stop();
    progressBar.steamBanFetcher.start(accountsSteamIds.length, 0, {
      account: "Отсутствует",
    });
    const accountsBans = Array();
    for (const steamId of accountsSteamIds) {
      const getBans = await steam.getPlayerBans(steamId);
      progressBar.steamBanFetcher.increment(1, { account: steamId });
      if (!getBans.length) continue;
      if (
        getBans[0]?.CommunityBanned ||
        getBans[0]?.VACBanned ||
        getBans[0]?.NumberOfGameBans
      )
        accountsBans.push(getBans[0]);
    }
    progressBar.steamBanFetcher.stop();
    console.clear();
    if (!accountsBans.length) return logger.info("Блокировок не найдено");
    logger.info(
      `Проверка вывела ${pluralize(accountsBans.length, [
        "аккаунт",
        "аккаунта",
        "аккаунтов",
      ])} с блокировкой. Подробнее в созданном файле`
    );
    writeFileSync(
      join(process.cwd(), this.config.filename + ".txt"),
      accountsBans
        .map((account) => {
          let message = steam.createProfileURL(account.SteamId);
          if (account.CommunityBanned) message += "| Комьюнити бан";
          if (account.VACBanned)
            message += `| Вак Бан - ${account.NumberOfVACBans}`;
          if (account.NumberOfGameBans)
            message += `| Игровая блокировка - ${account.NumberOfGameBans}`;
          message += `| Прошло дней - ${account.DaysSinceLastBan}`;
          return message;
        })
        .join(require("os").EOL)
    );
    return require("../utils/terminal/ExitTerminal");
  }

  async getSteamKey() {
    console.clear();
    let { steamKey } = await inquirer.default.prompt([
      {
        type: "input",
        name: "steamKey",
        message:
          "Введите ключ веб-API Steam (https://steamcommunity.com/dev/apikey):",
      },
    ]);
    steamKey = steamKey.trim();
    if (!isValidSteamKey(steamKey))
      throw new Error("ключ веб-API Steam неверный.");
    return steamKey;
  }

  async changeSteamKey() {
    console.clear();
    const steamKey = await this.getSteamKey();
    updateConfig({ steamKey });
    return this.openMenu();
  }

  async changeFilename() {
    console.clear();
    const { filename } = await inquirer.default.prompt([
      {
        type: "input",
        name: "filename",
        message: "Введите новое название:",
      },
    ]);
    if (!isValidWindowsFilename(filename))
      throw new Error("Недопустимое название для файла.");
    updateConfig({ filename });
    return this.openMenu();
  }

  back() {
    console.clear();
    return this.openMenu();
  }
};
