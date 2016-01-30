var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var Firebase = require('firebase');

/**
 * Instanciates a GuildRepository.
 * @param {object} firebase The authenticated firebase connection to the guild scope.
 * @returns {object} A GuildRepository instance.
 */
function GuildRepository(firebase) {
    if(!firebase || !firebase.getAuth()) {
        throw new Error('firebase must be a connection of Firebase');
    }
    this.firebase = firebase;
}

/**
 * Cleans all the previously savec characters that are no longer in the guild.
 * @param {array} fetchedCharacters An array of Character objects found in the scrape.
 * @returns {object} A promise that resolves once the cleaning has beren completed.
 */
GuildRepository.prototype.cleanRemovedCharacters = function cleanRemovedCharacters(fetchedCharacters) {
    var self = this;
    var fetchedCharactersName = _.map(fetchedCharacters, function(fetchedCharacter) {
        return fetchedCharacter.get('name');
    });
    fetchedCharactersName = new Set(fetchedCharactersName);

    return this.firebase.child('characters').once('value').then(function(savedCharacters) {
        var savedCharactersArray = [];
        _.forIn(savedCharacters.val(), function(savedCharacterData, savedCharacterName) {
            return savedCharactersArray.push({ name: savedCharacterName, data: savedCharacterData });
        });

        return Promise.map(savedCharactersArray, function(savedCharacter) {
            if(!fetchedCharactersName.has(savedCharacter.name)) {
                return Promise.props({
                    removedMember: self.removeExCharacter(savedCharacter.name),
                    savedExMember: self.saveExCharacter(savedCharacter.name, savedCharacter.data),
                    removedProfessions: self.removeExCharacterProfessions(savedCharacter.name),
                    removedReputations: self.removeExCharacterReputations(savedCharacter.name),
                    removedItems: self.removeExCharacterItems(savedCharacter.name),
                    removedBosskills: self.removeExCharacterBosskills(savedCharacter.name)
                })
            }
        });
    });
};

/**
 * Removes a character from the character node.
 * @param {string} exCharacterName The name of the character that's no longer in the guild.
 * @returns {object} A promise that resolves once the character is no longer in firebase.
 */
GuildRepository.prototype.removeExCharacter = function removeExCharacter(exCharacterName) {
    return this.firebase.child('characters/' + exCharacterName).remove();
};

/**
 * Saves the data of a character that's no longer in the guild.
 * @param {string} exCharacterName The name of the character that's no longer in the guild.
 * @param {object} data The data that used to be saved for that character.
 * @returns {object} A promise that resolves once the data has been saved in the ex-characters scope.
 */
GuildRepository.prototype.saveExCharacter = function saveExCharacter(exCharacterName, data) {
    return this.firebase.child('ex-characters/' + exCharacterName).set(data);
};

/**
 * Removes all the professions of a character that's no longer in the guild.
 * @param {string} exCharacterName The name of the character that's no longer in the guild.
 * @returns {object} A promise that resolves once the character professions are no longer in firebase.
 */
GuildRepository.prototype.removeExCharacterProfessions = function removeExCharacterProfessions(exCharacterName) {
    var self = this;
    return this.firebase.child('professions').once('value').then(function(professions) {
        var professionsName = _.keys(professions.val());
        return Promise.map(professionsName, function(professionName) {
            return self.firebase.child('professions/' + professionName + '/' + exCharacterName).remove();
        })
    });
};

/**
 * Removes all the reputations of a character that's no longer in the guild.
 * @param {string} exCharacterName The name of the character that's no longer in the guild.
 * @returns {object} A promise that resolves once the character reputations are no longer in firebase.
 */
GuildRepository.prototype.removeExCharacterReputations = function removeExCharacterReputations(exCharacterName) {
    var self = this;
    return this.firebase.child('reputations').once('value').then(function(reputations) {
        var reputationsName = _.keys(reputations.val());
        return Promise.map(reputationsName, function(reputationName) {
            return self.firebase.child('reputations/' + reputationName + '/' + exCharacterName).remove();
        });
    });
};

/**
 * Removes all the items of a character that's no longer in the guild.
 * @param {string} exCharacterName The name of the character that's no longer in the guild.
 * @returns {object} A promise that resolves once the character items are no longer in firebase.
 */
GuildRepository.prototype.removeExCharacterItems = function removeExCharacterItems(exCharacterName) {
    return this.firebase.child('items/' + exCharacterName).remove();
};

/**
 * Removes all the bosskills of a character that's no longer in the guild.
 * @param {string} exCharacterName The name of the character that's no longer in the guild.
 * @returns {object} A promise that resolves once the character bosskills are no longer in firebase.
 */
GuildRepository.prototype.removeExCharacterBosskills = function removeExCharacterBosskills(exCharacterName) {
    return this.firebase.child('bosskills/' + exCharacterName).remove();
};

/**
 * Saves a character to the guild.
 * @param {object} character The character object to save in the guild.
 * @returns {object} A promise that resolves once the character has been saved.
 */
GuildRepository.prototype.saveCharacter = function saveCharacter(character) {
    var characterName = character.get('name');
    var characterReference = this.firebase.child('characters/' + characterName);
    return characterReference.once('value').then(function(savedCharacter) {
        if(_.isEmpty(savedCharacter.val())) {
            var toInsert = _.extend(character.getData(), { dateAdded: moment.utc().format('YYYY-MM-DD') });
            characterReference.set(toInsert);
        }
        else {
            var toUpdate = character.getData();
            characterReference.update(toUpdate);
        }
    });
};

GuildRepository.prototype.saveProfession = function saveProfession() {

};

GuildRepository.prototype.cleanRemovedProfessions = function cleanRemovedProfessions() {

};

GuildRepository.prototype.saveReputation = function saveReputation() {

};

GuildRepository.prototype.saveActivity = function saveActivity() {

};

module.exports = GuildRepository;

