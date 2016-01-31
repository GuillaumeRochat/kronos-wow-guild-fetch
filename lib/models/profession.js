var util = require('util');
var _ = require('lodash');

var BaseModel = require('./base-model');

const PROFESSIONS = new Set(['herbalism', 'mining', 'skinning', 'alchemy', 'blacksmithing', 'enchanting',
    'engineering', 'leatherworking', 'tailoring', 'cooking', 'first aid', 'fishing', 'riding']);

/**
 * @returns {object} An instance of profession model.
 */
function Profession() {
    var model = {
        name: null,
        characterName: null,
        level: null
    };
    BaseModel.call(this, model);
}

util.inherits(Profession, BaseModel);

/**
 * @param {string} name The name of the profession, in lower case.
 * @returns {void}
 */
Profession.prototype.setName = function setName(name) {
    if(PROFESSIONS.has(name)) {
        this.model.name = name;
    }
    else {
        console.log(name);
    }
};

/**
 * @param {string} characterName The name of the character that has this profession.
 * @returns {void}
 */
Profession.prototype.setCharacterName = function setCharacterName(characterName) {
    if(_.isString(characterName) && !_.isEmpty(characterName)) {
        this.model.characterName = characterName;
    }
};

/**
 * @param {number} level The profession level, between 1 and 300.
 * @returns {void}
 */
Profession.prototype.setLevel = function setLevel(level) {
    if(_.isFinite(level) && _.inRange(level, 1, 301)) {
        this.model.level = level;
    }
};

module.exports = Profession;

