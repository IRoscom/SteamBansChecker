const cliProgress = require("cli-progress");

module.exports.steamIdResolver = new cliProgress.SingleBar(
  {
    format: "{bar} {percentage}% || Получено ID: {value}/{total}",
  },
  cliProgress.Presets.shades_classic
);

module.exports.steamBanFetcher = new cliProgress.SingleBar(
  {
    format:
      "{bar} {percentage}% || Проверено: {value}/{total}  || Предыдущий аккаунт: {account}",
  },
  cliProgress.Presets.shades_classic
);
