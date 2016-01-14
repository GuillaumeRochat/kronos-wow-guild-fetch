var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');

const GUILD_QUERY = 'guild-info.xml';

/**
 * Instanciates a Guild fetch.
 * @returns {object} An instance of Guild.
 */
function Guild(url, realm, guildName) {
    if(_.isEmpty(url) || _.isEmpty(realm) || _.isEmpty(guildName)) {
        throw new Error('url, realm  and guildName are all required');
    }
    if(!_.isString(url) || !_.isString(realm) ||  !_.isString(guildName)) {
        throw new Error('url, realm and guildName must all be string');
    }

    this.url = url;
    this.realm = realm;
    this.guildName = guildName;
}

/**
 * Starts the fetch + parse of the guild information.
 * @returns {object} A promise that resolves once all the guild info is parsed.
 */
Guild.prototype.getData = function getData() {
    var self = this;
    return this.fetch().then(function(data) {
        return self.parse(data);
    });
};

/**
 * Performs the call to get the data from the armory.
 * @returns {object} A promise that resolves once the armory replied.
 */
Guild.prototype.fetch = function fetch() {
    var query = this.getQuery();
    return request(query);
};

/**
 * Parses all the xml data returned from the armory.
 * @returns {object} A promise that resolves once the xml data has been parsed in models.
 */
Guild.prototype.parse = function parse(data) {
    var $ = cheerio.load(data);
    return Promise.resolve(function() { return true; });
};

/**
 * Returns the get query for guild information.
 * @return {string} The query to perform to get the data.
 */
Guild.prototype.getQuery = function getQuery() {
    var parsedGuildName = this.guildName.replace(/\s/g, '+');
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + GUILD_QUERY + '?r=' + parsedRealm + '&gn=' + parsedGuildName;
};

module.exports = Guild;

