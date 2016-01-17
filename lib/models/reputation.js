var util = require('util');
var _ = require('lodash');

var BaseModel = require('./base-model');

const FACTIONS = new Set(['darnassus', 'gnomeregan exiles', 'ironforge', 'stormwind', 'darkspear trolls', 'orgrimmar',
    'thunder bluff', 'undercity', 'league of arathor', 'silverwing sentinels', 'stormpike guard', 'defilers', 'frostwolf clan',
    'warsong outriders', 'booty bay', 'everlook', 'gadgetzan', 'ratchet', 'brood of nozdormu', 'cenarion circle', 'hydraxian waterlords',
    'zandalar tribe', 'argent dawn', 'bloodsail buccaneers', 'darkmoon faire', 'gelkis clan centaur', 'magram clan centaur',
    'ravenholdt', 'shen\'dralar', 'syndicate', 'thorium brotherhood', 'timbermaw hold', 'wintersaber trainers']);

/**
 * @returns {object} An instance of reputation model.
 */
function Reputation() {
    var model = {
        name: null,
        characterName: null,
        level: null
    };
    BaseModel.call(this, model);
}

util.inherits(Reputation, BaseModel);

/**
 * @param {string} name The name of the faction.
 * @returns {void}
 */
Reputation.prototype.setName = function setName(name) {
    if(FACTIONS.has(name)) {
        this.model.name = name;
    }
};

/**
 * @param {string} characterName The name of the character that has this reputation.
 * @returns {void}
 */
Reputation.prototype.setCharacterName = function setCharacterName(characterName) {
    if(_.isString(characterName) && !_.isEmpty(characterName)) {
        this.model.characterName = characterName;
    }
};

/**
 * @param {number} level The reputation level, between -42000 and 42999.
 * @returns {void}
 */
Reputation.prototype.setLevel = function setLevel(level) {
    if(_.isFinite(level) && _.inRange(level, -42000, 43000)) {
        this.model.level = level;
    }
};

module.exports = Reputation;

