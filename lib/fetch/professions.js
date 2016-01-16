var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');

var Profession = require('_/models/profession');

const PROFESSIONS_QUERY = 'character-sheet.xml';

function Professions(url, realm, characterName, guildName) {
    if(!_.isString(url) || !_.isString(realm) || !_.isString(characterName) || !_.isString(guildName)) {
        throw new Error('url, realm, characterName and guildName are all required and must be string');
    }

    this.url = url;
    this.realm = realm;
    this.characterName = characterName;
    this.guildName = guildName;
}

Professions.prototype.getData = function getData() {
    var self = this;
    return this.fetch().then(function() {
        return self.parse();
    });
};

Professions.prototype.fetch = function fetch() {
    var query = this.getQuery();
    return request(query);
};

Professions.prototype.parse = function parse() {
    return [new Profession()];
};

Professions.prototype.getQuery = function getQuery() {
    var parsedGuildName = this.guildName.replace(/\s/g, '+');
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + PROFESSIONS_QUERY + '?r=' + parsedRealm + '&cn=' + this.characterName + '&gn=' + parsedGuildName;
};

module.exports = Professions;

