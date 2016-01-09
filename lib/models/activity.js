var util = require('util');
var _ = require('lodash');
var moment = require('moment');

var BaseModel = require('./base-model');

const TYPE = new Set(['loot', 'bosskill']);

/**
 * Initializes an activity model.
 */
function Activity() {
    var model = {
        type: null,
        id: null,
        characterName: null,
        datetime: null
    };
    BaseModel.call(this, model);
}

util.inherits(Activity, BaseModel);

/**
 * @param {string} type The type of the activity.
 */
Activity.prototype.setType = function setType(type) {
    if(TYPE.has(type)) {
        this.model.type = type;
    }
};

/**
 * @param {number} id The activity Id above 0.
 */
Activity.prototype.setId = function setId(id) {
    if(_.isFinite(id) && id > 0) {
        this.model.id = id;
    }
};

/**
 * @param {string} characterName The name of the character that has that activity.
 */
Activity.prototype.setCharacterName = function setCharacterName(characterName) {
    if(_.isString(characterName) && !_.isEmpty(characterName)) {
        this.model.characterName = characterName;
    }
};

/**
 * @param {string} datetime The datetime the activity occurred in ISO-8601 UTC.
 */
Activity.prototype.setDatetime = function setDatetime(datetime) {
    if(moment(datetime, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
        this.model.datetime = datetime;
    }
};

module.exports = Activity;

