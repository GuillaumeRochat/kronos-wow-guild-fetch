var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');

var Reputation = require('_/models/reputation');

const REPUTATIONS_QUERY = 'character-reputation.xml';

/**
 * Instanciates a Reputations fetch.
 * @param {string} url The hostname where to fetch.
 * @param {string} realm The realm name of the character.
 * @param {string} characterName The name of the character for which to get the reputations.
 * @returns {object} An instance of Reputations.
 */
function Reputations(url, realm, characterName) {
    if(!_.isString(url) || !_.isString(realm) || !_.isString(characterName)) {
        throw new Error('url, realm and characterName are all required and must be string');
    }

    this.url = url;
    this.realm = realm;
    this.characterName = characterName;
}

/**
 * Starts the fetch + parse of the reputation information.
 * @returns {object} A promise that resolves once all reputation info is parsed.
 */
Reputations.prototype.getData = function getData() {
    var self = this;
    return this.fetch().then(function(data) {
        return self.parse(data);
    });
};

/**
 * Performs the call to get the data from the armory.
 * @returns {object} A promise that resolves once the armory replied.
 */
Reputations.prototype.fetch = function fetch() {
    var query = this.getQuery();
    return request(query);
};

/**
 * Parses all the xml data returned from the armory.
 * @returns {array} An array of Profession.
 */
Reputations.prototype.parse = function parse(data) {
    var $ = cheerio.load(data || '');
    var self = this;
    var reputations = [];

    $('faction faction').each(function(faction) {
        var reputation = new Reputation();
        reputation.setCharacterName(self.characterName.toLowerCase());

        var name = $(this).attr('name').toLowerCase();
        reputation.setName(name);

        var level = parseInt($(this).attr('reputation'));
        reputation.setLevel(level);

        reputations.push(reputation);
    });

    return reputations;
};

/**
 * Returns the get query for reputation information.
 * @returns {string} The query to perform to get the data.
 */
Reputations.prototype.getQuery = function getQuery() {
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + REPUTATIONS_QUERY + '?r=' + parsedRealm + '&cn=' + this.characterName;
};

module.exports = Reputations;

