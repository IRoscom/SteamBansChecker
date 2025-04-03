module.exports = {
  profilesAll:
    /https?:\/\/steamcommunity\.com\/(id\/[a-zA-Z0-9_-]+|profiles\/[0-9]+)/g,
  profiles: /https?:\/\/steamcommunity\.com\/profiles\/(\d+)/,
  vanity: /https?:\/\/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)/,
  steamKey: /^[A-F0-9]{32}$/,
};
