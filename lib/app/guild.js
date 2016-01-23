var _ = require('lodash');
var Promise = require('bluebird');

var Fetch = require('_/fetch');
var GuildConnection = require('./guild-connection');

function Guild(realm, guildName, guildConnection) {
    if(!_.isString(realm) || _.isEmpty(realm)) {
        throw new Error('realm string is required');
    }
    if(!_.isString(guildName) || _.isEmpty(guildName)) {
        throw new Error('guildName string is required');
    }
    if(!(guildConnection instanceof GuildConnection)) {
        throw new Error('guildConnection object is required');
    }

    this.fetch = new Fetch(realm);
    this.guildName = guildName;
    this.guildConnection = guildConnection;
}

Guild.prototype.run = function run() {
    return this.fetch.getCharacters(this.guildName).then(this.handleCharacters.bind(this));
};

Guild.prototype.handleCharacters = function handleCharacters(characters) {
    var self = this;
    // Clean characters no longer in the guild.
    return Promise.map(characters, function(character) {
        self.guildConnection.saveCharacter(character);
        return self.fetch.getProfessions(character.get('name')).then(self.handleProfessions.bind(self)).then(function() {
            return self.fetch.getReputations(character.get('name')).then(self.handleReputations.bind(self));
        }).then(function() {
            return self.fetch.getActivities(character.get('name')).then(self.handleActivities.bind(self));
        });
    });
};

Guild.prototype.handleProfessions = function handleProfessions(professions) {
    var self = this;
    // Clean professions no longer on character.
    return Promise.map(professions, function(profession) {
        self.guildConnection.saveProfession(profession);
    });
};

Guild.prototype.handleReputations = function handleReputations(reputations) {
    var self = this;
    return Promise.map(reputations, function(reputation) {
        self.guildConnection.saveReputation(reputation);
    });
};

Guild.prototype.handleActivities = function handleActivities(activities) {
    var self = this;
    return Promise.map(activities, function(activity) {
        self.guildConnection.saveActivity(activity);
    });
};

module.exports = Guild;

