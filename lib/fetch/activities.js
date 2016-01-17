var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');
var moment = require('moment');

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
    if(!_.isString(url) || !_.isString(realm) || !_.isString(characterName)) {
        throw new Error('url, realm and characterName are all required and must be string');
    }

    this.url = url;
    this.realm = realm;
    this.characterName = characterName;
};

/**
 * Starts the fetch + parse of the activity information.
 * @returns {object} A promise that resolves once all activity info is parsed.
 */
Activities.prototype.getData = function getData() {
    var self = this;
    return this.fetch().then(function(data) {
        return self.parse(data);
    });;
};

/**
 * Performs the call to get the data from the armory.
 * @returns {object} A promise that resolves once the armory replied.
 */
Activities.prototype.fetch = function fetch() {
    var query = this.getQuery();
    return request(query);
};

/**
 * Parses the xml data returned from the armory.
 * @returns {array} An array of Activity.
 */
Activities.prototype.parse = function parse(data) {
    var $ = cheerio.load(data);
    var self = this;
    var activities = [];

    $('event').each(function(event) {
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

/**
 * Returns the get query for activity information.
 * @returns {string} The query to perform to get the data.
 */
Activities.prototype.getQuery = function getQuery() {
    var parsedRealm = this.realm.replace(/\s/g, '+');

    return this.url + '/' + ACTIVITIES_QUERY + '?r=' + parsedRealm + '&cn=' + this.characterName;
};

module.exports = Activities;

