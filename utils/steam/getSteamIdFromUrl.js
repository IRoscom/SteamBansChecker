const { profiles, vanity } = require("../../models/RegExp");

/**
 * @param {String} url
 * @param {import('../../core/Steam')} steam
 * @returns {String}
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
