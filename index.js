const { join } = require("path");
const cliProgress = require("cli-progress");
const Steam = require("./class/Steam");
const { input } = require("@inquirer/prompts");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const getValidFilePath = require("./utils/getValidFilePath");
const { profilesAll } = require("./utils/RegExp");
const pluralize = require("./utils/pluralize");
const getSteamIdFromUrl = require("./utils/getSteamIdFromUrl");
const createConfig = require("./utils/createConfig");
const isValidSteamKey = require("./utils/isValidSteamKey");

const convertAccountsBar = new cliProgress.SingleBar(
  {
    format: "{bar} {percentage}% || {value}/{total} Сконвертировано",
  },
  cliProgress.Presets.shades_classic
);
const checkAccountsBar = new cliProgress.SingleBar(
  {
    format:
      "{bar} {percentage}% || {value}/{total} Проверено || Предыдущий аккаунт: {account}",
  },
  cliProgress.Presets.shades_classic
);
(async () => {
  try {
    if (!existsSync(join(process.cwd(), "config.json"))) await createConfig();
    const config = JSON.parse(
      readFileSync(join(process.cwd(), "config.json"), "utf-8")
    );
    if (!config?.steamKey || !isValidSteamKey(config?.steamKey))
      await createConfig();
    const steam = new Steam(config.steamKey);
    const answer = {
      files: await input({ message: "Отправьте путь до файла:" }),
    };
    if (!answer.files.endsWith(".txt"))
      throw new Error("Скрипт принимает только txt файлы");
    const accounts = readFileSync(getValidFilePath(answer.files), "utf-8");
    const accountsArray = accounts.match(profilesAll);
    const steamIds = Array();
    if (!accountsArray || !accountsArray.length)
      throw new Error("В файле отсутствуют ссылки на аккаунты.");
    console.info(
      `Найдено ${pluralize(accountsArray.length, [
        "ссылка",
        "ссылки",
        "ссылок",
      ])}`
    );
    convertAccountsBar.start(accountsArray.length, 0);
    for (const account of accountsArray) {
      const steamId = await getSteamIdFromUrl(account, steam);
      if (steamId) steamIds.push(steamId);
      convertAccountsBar.increment();
    }
    convertAccountsBar.stop();
    console.info(
      `Сконвертировалось ${steamIds.length}/${pluralize(accountsArray.length, [
        "ссылка",
        "ссылки",
        "ссылок",
      ])}`
    );
    checkAccountsBar.start(steamIds.length, 0, { account: "Отсутствует" });
    let accountList = Array();
    for (const steamId of steamIds) {
      const bans = await steam.getPlayerBans(steamId);
      const profile = bans[0];
      if (!bans.length) accountList.push({ steamId, status: "notFound" });
      else accountList.push(profile);
      checkAccountsBar.increment(1, { account: steamId });
    }
    checkAccountsBar.stop();
    accountList = accountList.filter(
      (account) =>
        account?.CommunityBanned ||
        account?.VACBanned ||
        account?.NumberOfGameBans
    );
    if (!accountList.length) return console.info("Блокировок не найдено");
    console.info(
      `Проверка вывела ${pluralize(accountList.length, [
        "аккаунт",
        "аккаунта",
        "аккаунтов",
      ])} с блокировкой. Подробнее в созданном файле`
    );
    writeFileSync(
      join(process.cwd(), "результаты.txt"),
      accountList
        .map(
          (account) =>
            `${steam.createProfileURL(account.SteamId)} | Коюнити Бан: ${
              account.CommunityBanned ? "Есть" : "Нет"
            } | Вак Бан: ${account.VACBanned ? "Есть" : "Нет"} | Игровой Бан: ${
              account.NumberOfGameBans ? "Есть" : "Нет"
            } | Количество вак банов: ${
              account.NumberOfVACBans
            } | Количество игровых банов: ${
              account.NumberOfGameBans
            } | Ласт бан: ${account.DaysSinceLastBan}`
        )
        .join(require("os").EOL)
    );
    require("readline")
      .createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      .question("Нажмите Enter для выхода...", () => process.exit(1));
  } catch (err) {
    if (err instanceof Error && err.name === "ExitPromptError") {
      console.info("👋 Увидемся в следующий раз!");
    } else {
      console.error(`Ошибка: ${err.message}`);
      require("readline")
        .createInterface({
          input: process.stdin,
          output: process.stdout,
        })
        .question("Нажмите Enter для выхода...", () => process.exit(1));
    }
  }
})();
