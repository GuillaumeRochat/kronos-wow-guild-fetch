var util = require('util');
var _ = require('lodash');
var moment = require('moment');

var BaseModel = require('./base-model');

const TYPE = new Set(['loot', 'bosskill']);

/**
 * @returns {object} An instance of activity model.
 */
function Activity() {
    var model = {
        type: null,
        id: null,
        characterName: null,
        bossKillID: null,
        datetime: null
    };
    BaseModel.call(this, model);
}

util.inherits(Activity, BaseModel);

/**
 * @param {string} type The type of the activity.
 * @returns {void}
 */
Activity.prototype.setType = function setType(type) {
    if(TYPE.has(type)) {
        this.model.type = type;
    }
};

/**
 * @param {number} id The activity Id above 0.
 * @returns {void}
 */
Activity.prototype.setId = function setId(id) {
    if(_.isFinite(id) && id > 0) {
        this.model.id = id|0;
    }
};

/**
 * @param {string} characterName The name of the character that has that activity.
 * @returns {void}
 */
Activity.prototype.setCharacterName = function setCharacterName(characterName) {
    if(_.isString(characterName) && !_.isEmpty(characterName)) {
        this.model.characterName = characterName;
    }
};

/**
 * @param {number} bossKillID The bossKillID above 0.
 * @returns {void}
 */
Activity.prototype.setBossKillID = function setBossKillID(bossKillID) {
    if(_.isFinite(bossKillID) && bossKillID > 0) {
        this.model.bossKillID = bossKillID|0;
    }
};

/**
 * @param {string} datetime The datetime the activity occurred in ISO-8601 UTC.
 * @returns {void}
 */
Activity.prototype.setDatetime = function setDatetime(datetime) {
    if(moment(datetime, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
        this.model.datetime = datetime;
    }
};

module.exports = Activity;

