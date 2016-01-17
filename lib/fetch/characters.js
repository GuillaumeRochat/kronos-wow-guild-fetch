var util = require('util');
var cheerio = require('cheerio');
var _ = require('lodash');

var BaseFetch = require('./base-fetch');
var Character = require('_/models/character');

const CHARACTERS_QUERY = 'guild-info.xml';

/**
 * Instanciates a Characters fetch.
 * @param {string} url The hostname where to fetch.
 * @param {string} realm The realm of the guild.
 * @param {string} guildName The name of the guild for which to get the characters.
 * @returns {object} An instance of Characters.
 */
function Characters(url, realm, guildName) {
    BaseFetch.call(this, url, realm);

    if(!_.isString(guildName)) {
        throw new Error('url, realm and guildName are all required and must be string');
    }
    this.guildName = guildName;
}

util.inherits(Characters, BaseFetch);

/**
 * Returns the get query for guild information.
 * @returns {string} The query to perform to get the data.
 */
Characters.prototype.getQuery = function getQuery() {
    var parsedGuildName = this.guildName.replace(/\s/g, '+');
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + CHARACTERS_QUERY + '?r=' + parsedRealm + '&gn=' + parsedGuildName;
};

/**
 * Parses all the xml data returned from the armory.
 * @returns {array} An array of Character.
 */
Characters.prototype.parse = function parse(data) {
    var $ = cheerio.load(data || '');
    var self = this;
    var characters = [];

    $('character').each(function() {
        var character = new Character();

        var name = $(this).attr('name').toLowerCase();
        character.setName(name);

        var classID = $(this).attr('classid');
        var className = self.getClass(classID);
        character.setClass(className);

        var raceID = $(this).attr('raceid');
        var raceName = self.getRace(raceID);
        character.setRace(raceName);

        var level = parseInt($(this).attr('level'));
        character.setLevel(level);

        var guildRank = parseInt($(this).attr('rank'));
        character.setGuildRank(guildRank);

        characters.push(character);
    });

    return characters;
};

/**
 * Returns the class name for the provided class id.
 * @param {number} classID The ID of the class.
 * @returns {string|null} The name of the class or null if not found.
 */
Characters.prototype.getClass = function getClass(classID) {
    var map = {
        1: 'warrior',
        2: 'paladin',
        3: 'hunter',
        4: 'rogue',
        5: 'priest',
        7: 'shaman',
        8: 'mage',
        9: 'warlock',
        11: 'druid'
    };
    return map[classID] || null;
};

/**
 * Returns the race name for the provided race id.
 * @param {number} raceID The ID of the race.
 * @returns {string|null} The name of the race or null if not found.
 */
Characters.prototype.getRace = function getRace(raceID) {
    var map = {
        1: 'human',
        2: 'orc',
        3: 'dwarf',
        4: 'night elf',
        5: 'undead',
        6: 'tauren',
        7: 'gnome',
        8: 'troll'
    };
    return map[raceID] || null;
};

/**
 * Returns the gender name for the provided gender id.
 * @param {number} genderID The ID of the gender.
 * @returns {string|null} The name of the gender or null if not found.
 */
Characters.prototype.getGender = function getGender(genderID) {
    var map = {
        0: 'male',
        1: 'female'
    };
    return map[genderID] || null;
};

module.exports = Characters;
