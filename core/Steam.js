const axios = require("axios/dist/node/axios.cjs");

module.exports = class Steam {
  constructor(key) {
    this.key = key;
    this.endpoint = "http://api.steampowered.com";
  }
  /**
   * @typedef {Object} SteamParamsGetPlayerBans
   * @property {String} SteamId
   * @property {Boolean} CommunityBanned
   * @property {Boolean} VACBanned
   * @property {Number} NumberOfVACBans
   * @property {Number} DaysSinceLastBan
   * @property {Number} NumberOfGameBans
   * @property {String} EconomyBan
   * @param {String} ids
   * @returns {Promise<Array<SteamParamsGetPlayerBans>>}
   */
  getPlayerBans(ids) {
    const url = this.createURL({
      intefrace: "ISteamUser",
      method: "GetPlayerBans",
      version: 1,
    }).toString();
    return axios
      .get(url, { params: { key: this.key, steamids: ids } })
      .then((result) => result.data?.players);
  }
  /**
   * @typedef {Object} SteamParamsResolveVanityURL
   * @property {String} steamid
   * @property {Number} success
   * @param {String} vanityurl
   * @returns {Promise<SteamParamsResolveVanityURL>}
   */
  resolveVanityURL(vanityurl) {
    const url = this.createURL({
      intefrace: "ISteamUser",
      method: "ResolveVanityURL",
      version: 1,
    }).toString();
    return axios
      .get(url, { params: { key: this.key, vanityurl } })
      .then((result) => result.data?.response);
  }
  /**
   * @typedef {Object} Options
   * @property {String} intefrace
   * @property {String} method
   * @property {Number} version
   * @param {Options} param0
   * @returns {URL}
   */
  createURL({ intefrace, method, version }) {
    return new URL(`${this.endpoint}/${intefrace}/${method}/v${version}/`);
  }

  /**
   * @param {String} id
   * @returns {String}
   */
  createProfileURL(id) {
    return "https://steamcommunity.com/profiles/" + id;
  }
};
