var _ = require('lodash');

var Characters = require('./characters');
var Professions = require('./professions');
var Reputations = require('./reputations');
var Activities = require('./activities');

const URL = 'http://armory.twinstar.cz';

/**
 * Instanciates a Fetch.
 * @param {string} realm The realm on which to perform the fetch.
 * @returns {object} An instance of Fetch.
 */
function Fetch(realm) {
    if(!_.isString(realm)) {
        throw new Error('realm is required and must be a string');
    }
    this.realm = realm;
}

/**
 * Starts a characters fetch.
 * @param {string} guildName The name of the guild for which to fetch characters.
 * @returns {object} A promise that resolves to an array of Character.
 */
Fetch.prototype.getCharacters = function getCharacters(guildName) {
    var characters = new Characters(URL, this.realm, guildName);
    return characters.getData();
};

/**
 * Starts a professions fetch.
 * @param {string} characterName The name of the character for which to fetch professions.
 * @returns {object} A promise that resolves to an array of Profession.
 */
Fetch.prototype.getProfessions = function getProfessions(characterName) {
    var professions = new Professions(URL, this.realm, characterName);
    return professions.getData();
};

/**
 * Starts a reputations fetch.
 * @param {string} characterName The name of the character for which to fetch reputations.
 * @returns {object} A promise that resolves to an array of Reputation.
 */
Fetch.prototype.getReputations = function getReputations(characterName) {
    var reputations = new Reputations(URL, this.realm, characterName);
    return reputations.getData();
};

/**
 * Starts an activities fetch.
 * @param {string} characterName The name of the character for which to fetch activities.
 * @returns {object} A promise that resolves to an array of Activity.
 */
Fetch.prototype.getActivities = function getActivities(characterName) {
    var activities = new Activities(URL, this.realm, characterName);
    return activities.getData();
};

module.exports = Fetch;
