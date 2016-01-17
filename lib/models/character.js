var util = require('util');
var _ = require('lodash');

var BaseModel = require('./base-model');

const CLASSES = new Set(['druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior']);
const RACES = new Set(['human', 'dwarf', 'night elf', 'gnome', 'orc', 'undead', 'tauren', 'troll']);
const GENDER = new Set(['male', 'female']);

/**
 * @returns {object} An instance of character model.
 */
function Character() {
    var model = {
        name: null,
        class: null,
        race: null,
        gender: null,
        level: null,
        guildRank: null
    };
    BaseModel.call(this, model);
}

util.inherits(Character, BaseModel);

/**
 * @param {string} name The name of the character.
 * @returns {void}
 */
Character.prototype.setName = function setName(name) {
    if(_.isString(name) && !_.isEmpty(name)) {
        this.model.name = name;
    }
};

/**
 * @param {string} className The class name of the character, in lower case.
 * @returns {void}
 */
Character.prototype.setClass = function setClass(className) {
    if(CLASSES.has(className)) {
        this.model.class = className;
    }
};

/**
 * @param {string} race The race of the character, in lower case.
 * @returns {void}
 */
Character.prototype.setRace = function setRace(race) {
    if(RACES.has(race)) {
        this.model.race = race;
    }
};

/**
 * @param {string} gender The gender of the character, in lower case.
 * @returns {void}
 */
Character.prototype.setGender = function setGender(gender) {
    if(GENDER.has(gender)) {
        this.model.gender = gender;
    }
};

/**
 * @param {number} level The level of the character, between 1 and 60.
 * @returns {void}
 */
Character.prototype.setLevel = function setLevel(level) {
    if(_.isFinite(level) && _.inRange(level, 1, 61)) {
        this.model.level = level;
    }
};

/**
 * @param {number} guildRank The guild rank of the character, 0 or above.
 * @returns {void}
 */
Character.prototype.setGuildRank = function setGuildRank(guildRank) {
    if(_.isFinite(guildRank) && guildRank >= 0) {
        this.model.guildRank = guildRank;
    }
};

/**
 * The name of the character is a key in firebase, so we don't return it.
 * @returns {Object} The whole character model excluding the name.
 */
Character.prototype.getData = function getData() {
    if(this.isValid()) {
        return _.omit(this.model, 'name');
    }
    return null;
};

module.exports = Character;

