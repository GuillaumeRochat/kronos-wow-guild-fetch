var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');

var Profession = require('_/models/profession');

const PROFESSIONS_QUERY = 'character-sheet.xml';

/**
 * Instanciates a Professions fetch.
 * @param {string} url The hostname where to fetch.
 * @param {string} realm The realm name of the character.
 * @param {string} characterName The name of the character for which to get the professions.
 * @returns {object} An instance of Professions.
 */
function Professions(url, realm, characterName) {
    if(!_.isString(url) || !_.isString(realm) || !_.isString(characterName)) {
        throw new Error('url, realm and characterName are all required and must be string');
    }

    this.url = url;
    this.realm = realm;
    this.characterName = characterName;
}

/**
 * Starts the fetch + parse of the profession information.
 * @returns {object} A promise that resolves once all the profession info is parsed.
 */
Professions.prototype.getData = function getData() {
    var self = this;
    return this.fetch().then(function(data) {
        return self.parse(data);
    });
};

/**
 * Performs the call to get the data from the armory.
 * @returns {object} A promise that resolves once the armory replied.
 */
Professions.prototype.fetch = function fetch() {
    var query = this.getQuery();
    return request(query);
};

/**
 * Parses all the xml data returned from the armory.
 * @returns {array} An array of Profession.
 */
Professions.prototype.parse = function parse(data) {
    var $ = cheerio.load(data || '');
    var self = this;
    var professions = [];

    $('professions skill').each(function() {
        var profession = new Profession();
        profession.setCharacterName(self.characterName);

        var name = $(this).attr('name').toLowerCase();
        profession.setName(name);

        var level = parseInt($(this).attr('value'));
        profession.setLevel(level);

        professions.push(profession);
    });

    $('skills skill').each(function() {
        var level = parseInt($(this).attr('skill'));
        if(level > 0) {
            var profession = new Profession();
            profession.setCharacterName(self.characterName);

            var name = $(this).attr('name').toLowerCase();
            profession.setName(name);

            profession.setLevel(level);

            professions.push(profession);
        }
    });

    return professions;
};

/**
 * Returns the get query for profession information.
 * @returns {string} The query to perform to get the data.
 */
Professions.prototype.getQuery = function getQuery() {
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + PROFESSIONS_QUERY + '?r=' + parsedRealm + '&cn=' + this.characterName;
};

module.exports = Professions;

