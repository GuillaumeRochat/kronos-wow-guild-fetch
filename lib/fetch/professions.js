var util = require('util');
var cheerio = require('cheerio');
var _ = require('lodash');

var BaseFetch = require('./base-fetch');
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
    BaseFetch.call(this, url, realm);

    if(!_.isString(characterName)) {
        throw new Error('url, realm and characterName are all required and must be string');
    }
    this.characterName = characterName;
}

util.inherits(Professions, BaseFetch);

/**
 * Returns the get query for profession information.
 * @returns {string} The query to perform to get the data.
 */
Professions.prototype.getQuery = function getQuery() {
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + PROFESSIONS_QUERY + '?r=' + parsedRealm + '&cn=' + this.characterName;
};

/**
 * Parses all the xml data returned from the armory.
 * @param {string} data The xml data from the armory.
 * @returns {array} An array of Profession.
 */
Professions.prototype.parse = function parse(data) {
    var $ = cheerio.load(data || '');
    var self = this;
    var professions = [];

    $('professions skill').each(function() {
        var profession = new Profession();
        profession.setCharacterName(self.characterName.toLowerCase());

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
            profession.setCharacterName(self.characterName.toLowerCase());

            var name = $(this).attr('name').toLowerCase();
            profession.setName(name);

            profession.setLevel(level);

            professions.push(profession);
        }
    });

    return professions;
};

module.exports = Professions;
