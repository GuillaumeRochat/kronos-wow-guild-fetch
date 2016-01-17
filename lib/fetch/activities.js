var util = require('util');
var cheerio = require('cheerio');
var _ = require('lodash');
var moment = require('moment');

var BaseFetch = require('./base-fetch');
var Activity = require('_/models/activity');

const ACTIVITIES_QUERY = 'character-feed.xml';

/**
 * Instanciates an Activities fetch.
 * @param {string} url The hostname where to fetch.
 * @param {string} realm The realm name of the character.
 * @param {string} characterName The name of the character for which to get the activities.
 * @returns {object} An instance of Activities.
 */
function Activities(url, realm, characterName) {
    BaseFetch.call(this, url, realm);

    if(!_.isString(characterName)) {
        throw new Error('url, realm and characterName are all required and must be string');
    }
    this.characterName = characterName;
}

util.inherits(Activities, BaseFetch);

/**
 * Returns the get query for activity information.
 * @returns {string} The query to perform to get the data.
 */
Activities.prototype.getQuery = function getQuery() {
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + ACTIVITIES_QUERY + '?r=' + parsedRealm + '&cn=' + this.characterName;
};

/**
 * Parses the xml data returned from the armory.
 * @param {string} data The xml data from the armory.
 * @returns {array} An array of Activity.
 */
Activities.prototype.parse = function parse(data) {
    var $ = cheerio.load(data);
    var self = this;
    var activities = [];

    $('event').each(function() {
        var activity = new Activity();
        activity.setCharacterName(self.characterName.toLowerCase());

        var type = $(this).attr('type').toLowerCase();
        activity.setType(type);

        var id = parseInt($(this).attr('id'));
        activity.setId(id);

        var date = $(this).attr('date');
        var time = $(this).attr('time');
        var datetime = moment(date + time, 'DD.MM.YYYYHH:mm:ss');
        datetime.subtract(1, 'hour');
        activity.setDatetime(datetime.format('YYYY-MM-DDTHH:mm:ss') + 'Z');

        activities.push(activity);
    });

    return activities;
};

module.exports = Activities;
