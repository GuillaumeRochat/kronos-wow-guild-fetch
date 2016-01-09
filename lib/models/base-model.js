var _ = require('lodash');

/**
 * @param {object} model The empty model format.
 */
function BaseModel(model) {
    this.model = model;
}

/**
 * @returns {boolean} Returns true if no model value is null.
 */
BaseModel.prototype.isValid = function isValid() {
    var hasNull = false;
    _.forIn(this.model, function(value) {
        hasNull = value === null || hasNull;
    });
    return !hasNull;
};

/**
 * @param {string} key The name of a key from the model.
 * @returns {multiple} The value of the specified key.
 */
BaseModel.prototype.get = function get(key) {
    if(_.isString(key) && this.model.hasOwnProperty(key)) {
        return this.model[key];
    }
    return null;
};

module.exports = BaseModel;
