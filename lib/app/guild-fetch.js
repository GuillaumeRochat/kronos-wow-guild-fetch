var _ = require('lodash');
var Promise = require('bluebird');

var Fetch = require('_/fetch');
var GuildRepository = require('./guild-repository');

/**
 * Instanciates a GuildFetch.
 * @param {string} realm The realm on which to fetch.
 * @param {string} guildName The name of the guild to fetch.
 * @param {object} guildRepository The data repository for the guild.
 * @returns {void}
 */
function GuildFetch(realm, guildName, guildRepository) {
    if(!_.isString(realm) || _.isEmpty(realm)) {
        throw new Error('realm string is required');
    }
    if(!_.isString(guildName) || _.isEmpty(guildName)) {
        throw new Error('guildName string is required');
    }
    if(!(guildRepository instanceof GuildRepository)) {
        throw new Error('guildRepository object is required');
    }

    this.fetch = new Fetch(realm);
    this.guildName = guildName;
    this.guildRepository = guildRepository;
}

/**
 * Starts the fetching loop for the guild.
 * @returns {object} A promise that resolves once the guild loop has been completed.
 */
GuildFetch.prototype.run = function run() {
    return this.fetch.getCharacters(this.guildName).then(this.handleCharacters.bind(this));
};

/**
 * Handles the fetched characters.
 * @param {array} characters An array of Character objects.
 * @returns {object} A promise that resolves once all the characters have been saved.
 */
GuildFetch.prototype.handleCharacters = function handleCharacters(characters) {
    var self = this;
    this.guildRepository.cleanRemovedCharacters(characters);
    return Promise.map(characters, function(character) {
        var characterName = character.get('name');
        self.guildRepository.saveCharacter(character);
        return self.fetch.getProfessions(characterName).then(function(professions) {
            return self.handleProfessions(characterName, professions);
        }).then(function() {
            return self.fetch.getReputations(characterName).then(self.handleReputations.bind(self));
        }).then(function() {
            return self.fetch.getActivities(characterName).then(self.handleActivities.bind(self));
        });
    });
};

/**
 * Handles the fetched professions for a single character.
 * @param {string} characterName The name of the character that has the professions, required for the clean.
 * @param {array} professions An array of Profession objects.
 * @returns {object} A promise that resolves once all the professions have been saved.
 */
GuildFetch.prototype.handleProfessions = function handleProfessions(characterName, professions) {
    var self = this;
    this.guildRepository.cleanRemovedProfessions(characterName, professions);
    return Promise.map(professions, function(profession) {
        self.guildRepository.saveProfession(profession);
    });
};

/**
 * Handles the fetched reputations for a single character.
 * @param {array} reputations An array of Reputation objects.
 * @returns {object} A promise that resolves once all the reputations have been saved.
 */
GuildFetch.prototype.handleReputations = function handleReputations(reputations) {
    var self = this;
    return Promise.map(reputations, function(reputation) {
        self.guildRepository.saveReputation(reputation);
    });
};

/**
 * Handles the fetched activities for a single character.
 * @param {array} activities An array of Activity objects.
 * @returns {object} A promise that resolves once all the activities have been saved.
 */
GuildFetch.prototype.handleActivities = function handleActivities(activities) {
    var self = this;
    return Promise.map(activities, function(activity) {
        self.guildRepository.saveActivity(activity);
    });
};

module.exports = GuildFetch;

