var _ = require('lodash');
var Promise = require('bluebird');
var Firebase = require('firebase');

function GuildRepository(firebase) {
    if(!firebase || !firebase.getAuth()) {
        throw new Error('firebase must be a connection of Firebase');
    }
    this.firebase = firebase;
}

GuildRepository.prototype.cleanRemovedCharacters = function cleanRemovedCharacters(fetchedCharacters) {
    var self = this;
    var fetchedCharactersName = _.map(fetchedCharacters, function(fetchedCharacter) {
        return fetchedCharacter.get('name');
    });
    fetchedCharactersName = new Set(fetchedCharactersName);
    var membersFirebase = this.firebase.child('members');
    return membersFirebase.once('value').then(function(savedCharacters) {
        _.forIn(savedCharacters.val(), function(savedCharacterData, savedCharacterName) {
            if(!fetchedCharactersName.has(savedCharacterName)) {
                return Promise.props({
                    remove: self.firebase.child('members/' + savedCharacterName).remove(),
                    save: self.firebase.child('ex-members/' + savedCharacterName).set(savedCharacterData)
                });
            }
        });
    });
};

GuildRepository.prototype.saveCharacter = function saveCharacter() {

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

