var _ = require('lodash');

const FACTIONS = new Set(['darnassus', 'gnomeregan exiles', 'ironforge', 'stormwind', 'darkspear trolls', 'orgrimmar',
    'thunder bluff', 'undercity', 'league of arathor', 'silverwing sentinels', 'stormpike guard', 'defilers', 'frostwolf clan',
    'warsong outriders', 'booty bay', 'everlook', 'gadgetzan', 'ratchet', 'brood of nozdormu', 'cenarion circle', 'hydraxian waterlords',
    'zandalar tribe', 'argent dawn', 'bloodsail buccaneers', 'darkmoon faire', 'gelkis clan centaur', 'magram clan centaur',
    'ravenholdt', 'shen\'dralar', 'syndicate', 'thorium brotherhood', 'timbermaw hold', 'wintersaber trainers']);

/**
 * Instanciates a reputation model.
 */
function Reputation() {
    this.model = {
        name: null,
        characterName: null,
        level: null
    };
}

/**
 * @param {string} name The name of the faction.
 */
Reputation.prototype.setName = function setName(name) {
    if(FACTIONS.has(name)) {
        this.model.name = name;
    }
};

/**
 * @param {string} characterName The name of the character that has this reputation.
 */
Reputation.prototype.setCharacterName = function setCharacterName(characterName) {
    if(_.isString(characterName) && !_.isEmpty(characterName)) {
        this.model.characterName = characterName;
    }
};

/**
 * @param {number} level The reputation level, between -42000 and 42999.
 */
Reputation.prototype.setLevel = function setLevel(level) {
    if(_.isFinite(level) && _.inRange(level, -42000, 43000)) {
        this.model.level = level;
    }
};

/**
 * @returns {boolean} Returns true if no model value is null.
 */
Reputation.prototype.isValid = function isValid() {
    var hasNull = false;
    _.forIn(this.model, function(value) {
        hasNull = value === null || hasNull;
    });
    return !hasNull;
};

/**
 * @returns {multiple} Returns the value of the specified key or null if the key doesn't exist.
 */
Reputation.prototype.get = function get(key) {
    if(_.isString(key) && this.model.hasOwnProperty(key)) {
        return this.model[key];
    }
    return null;
};

module.exports = Reputation;

