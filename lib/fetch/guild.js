var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');

const GUILD_QUERY = 'guild-info.xml';

function Guild(url, guildName) {
    if(_.isEmpty(url) || _.isEmpty(guildName)) {
        throw new Error('url and guildName are both required');
    }
    if(!_.isString(url) || !_.isString(guildName)) {
        throw new Error('url and guildName must both be string');
    }

    this.url = url;
    this.guildName = guildName;
}

Guild.prototype.getData = function getData() {
    var self = this;
    return this.request().then(function() {
        return self.parse();
    }).then(function() {
        return self.results();
    });
};

Guild.prototype.request = function request() {
    return Promise.resolve(function() { return true; });
};

Guild.prototype.parse = function parse() {
    return Promise.resolve(function() { return true; });
};

Guild.prototype.results = function results() {
    return Promise.resolve(function() { return true; });
};

module.exports = Guild;

