var _ = require('lodash');
var moment = require('moment');

/**
 * Initializes an item model.
 */
function Item() {
    this.model = {
        id: null,
        characterName: null,
        datetime: null
    };
}

/**
 * @param {number} id The item Id above 0.
 */
Item.prototype.setId = function setId(id) {
    if(_.isFinite(id) && id > 0) {
        this.model.id = id;
    }
};

/**
 * @param {string} characterName The name of the character that has that item.
 */
Item.prototype.setCharacterName = function setCharacterName(characterName) {
    if(_.isString(characterName) && !_.isEmpty(characterName)) {
        this.model.characterName = characterName;
    }
};

/**
 * @param {string} datetime The datetime the item was acquired in ISO-8601 UTC.
 */
Item.prototype.setDatetime = function setDatetime(datetime) {
    if(moment(datetime, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
        this.model.datetime = datetime;
    }
};

/**
 * @returns {boolean} Returns true if no model value is null.
 */
Item.prototype.isValid = function isValid() {
    var hasNull = false;
    _.forIn(this.model, function(value) {
        hasNull = value === null || hasNull;
    });
    return !hasNull;
}

/**
 * @param {string} key The name of a key to get from the model.
 * @returns {multiple} Returns the value of the specified key or null if the key doesn't exist.
 */
Item.prototype.get = function get(key) {
    if(_.isString(key) && this.model.hasOwnProperty(key)) {
        return this.model[key];
    }
    return null;
};

module.exports = Item;

