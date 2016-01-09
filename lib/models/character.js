var _ = require('lodash');

const CLASSES = new Set(['druid', 'hunter', 'mage', 'paladin', 'priest', 'rogue', 'shaman', 'warlock', 'warrior']);
const RACES = new Set(['human', 'dwarf', 'night elf', 'gnome', 'orc', 'undead', 'tauren', 'troll']);
const GENDER = new Set(['male', 'female']);

/**
 * Instanciates a character model.
 */
function Character() {
    this.model = {
        name: null,
        class: null,
        race: null,
        gender: null,
        level: null,
        guildRank: null
    };
}

/**
 * @param {string} name The name of the character.
 */
Character.prototype.setName = function setName(name) {
    if(_.isString(name) && !_.isEmpty(name)) {
        this.model.name = name;
    }
};

/**
 * @param {string} className The class name of the character, in lower case.
 */
Character.prototype.setClass = function setClass(className) {
    if(CLASSES.has(className)) {
        this.model.class = className;
    }
};

/**
 * @param {string} race The race of the character, in lower case.
 */
Character.prototype.setRace = function setRace(race) {
    if(RACES.has(race)) {
        this.model.race = race;
    }
};

/**
 * @param {string} gender The gender of the character, in lower case.
 */
Character.prototype.setGender = function setGender(gender) {
    if(GENDER.has(gender)) {
        this.model.gender = gender;
    }
};

/**
 * @param {number} level The level of the character, between 1 and 60.
 */
Character.prototype.setLevel = function setLevel(level) {
    if(_.isFinite(level) && _.inRange(level, 1, 61)) {
        this.model.level = level;
    }
};

/**
 * @param {number} guildRank The guild rank of the character, 0 or above.
 */
Character.prototype.setGuildRank = function setGuildRank(guildRank) {
    if(_.isFinite(guildRank) && guildRank >= 0) {
        this.model.guildRank = guildRank;
    }
};

/**
 * @returns {boolean} Returns true if no model key is null.
 */
Character.prototype.isValid = function isValid() {
    var hasNull = false;
    _.forIn(this.model, function(value, key) {
        hasNull = value === null || hasNull;
    });
    return !hasNull;
}

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

/**
 * @returns {multiple} Returns the value of the specified key or null if the key doesn't exist.
 */
Character.prototype.get = function get(key) {
    if(_.isString(key) && this.model.hasOwnProperty(key)) {
        return this.model[key];
    }
    return null;
};

module.exports = Character;

