const { profiles, vanity } = require("./RegExp");

/**
 * @param {String} url
 * @param {import('../class/Steam')} steam
 */
module.exports = async (url, steam) => {
  const profilesMatch = url.match(profiles);
  const vanityMatch = url.match(vanity);
  if (profilesMatch) {
    return profilesMatch[1];
  }

  return steam
    .resolveVanityURL(vanityMatch[1])
    .then((result) => result.steamid);
};
