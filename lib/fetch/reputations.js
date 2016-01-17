var util = require('util');
var cheerio = require('cheerio');
var _ = require('lodash');

var BaseFetch = require('./base-fetch');
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
    BaseFetch.call(this, url, realm);

    if(!_.isString(characterName)) {
        throw new Error('url, realm and characterName are all required and must be string');
    }
    this.characterName = characterName;
}

util.inherits(Reputations, BaseFetch);

/**
 * Returns the get query for reputation information.
 * @returns {string} The query to perform to get the data.
 */
Reputations.prototype.getQuery = function getQuery() {
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + REPUTATIONS_QUERY + '?r=' + parsedRealm + '&cn=' + this.characterName;
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

module.exports = Reputations;

