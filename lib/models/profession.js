var _ = require('lodash');

const PROFESSIONS = new Set(['herbalism', 'mining', 'skinning', 'alchemy', 'blacksmithing', 'enchanting',
    'engineering', 'leatherworking', 'tailoring', 'cooking', 'first aid', 'fishing']);

/**
 * Instanciates a profession model.
 */
function Profession() {
    this.model = {
        name: null,
        characterName: null,
        level: null
    };
}

/**
 * @param {string} name The name of the profession, in lower case.
 */
Profession.prototype.setName = function setName(name) {
    if(PROFESSIONS.has(name)) {
        this.model.name = name;
    }
};

/**
 * @param {string} characterName The name of the character that has this profession.
 */
Profession.prototype.setCharacterName = function setCharacterName(characterName) {
    if(_.isString(characterName) && !_.isEmpty(characterName)) {
        this.model.characterName = characterName;
    }
};

/**
 * @param {number} level The profession level, between 1 and 300.
 */
Profession.prototype.setLevel = function setLevel(level) {
    if(_.isFinite(level) && _.inRange(level, 1, 301)) {
        this.model.level = level;
    }
};

/**
 * @returns {boolean} Returns true if no model value is null.
 */
Profession.prototype.isValid = function isValid() {
    var hasNull = false;
    _.forIn(this.model, function(value) {
        hasNull = value === null || hasNull;
    });
    return !hasNull;
};

/**
 * @param {string} key The name of a key to get from the model.
 * @returns {multiple} Returns the value of the specified key or null if the key doesn't exist.
 */
Profession.prototype.get = function get(key) {
    if(_.isString(key) && this.model.hasOwnProperty(key)) {
        return this.model[key];
    }
    return null;
};

module.exports = Profession;

