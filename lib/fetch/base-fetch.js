var request = require('request-promise');
var _ = require('lodash');
var cheerio = require('cheerio');

/**
 * Instanciates a BaseFetch.
 * @param {string} url The hostname where to fetch.
 * @param {string} realm The realm name for the fetch.
 * @returns {object} An instance of BaseFetch.
 */
function BaseFetch(url, realm) {
    if(!_.isString(url) || !_.isString(realm)) {
        throw new Error('url and realm are required and must be string');
    }

    this.url = url;
    this.realm = realm;
}

/**
 * Starts the fetch + parse.
 * @returns {object} A promise that resolves once all info is parsed.
 */
BaseFetch.prototype.getData = function getData() {
    var self = this;
    return this.fetch().then(function(data) {
        return self.parse(data);
    });
};

/**
 * Performs the call to get the data from the armory.
 * @returns {object} A promise that resolves once the armory replied.
 */
BaseFetch.prototype.fetch = function fetch() {
    var self = this;
    var query = this.getQuery();
    return request(query).then(function(data) {
        return self.validate(data);
    });
};

/**
 * Validates that the page we got is not an error page.
 * @param {string} data The body of the page we received.
 * @returns {string} The same data if the validation succeeded.
 */
BaseFetch.prototype.validate = function validate(data) {
    var $ = cheerio.load(data || '');
    if($('errorhtml').length) {
        throw new Error('Error page encountered');
    }
    return data;
}

/**
 * Parses the xml data returned from the armory.
 * @returns {void}
 */
BaseFetch.prototype.parse = function parse() {};

/**
 * Returns the get query.
 * @returns {string} The query to perform to get the data.
 */
BaseFetch.prototype.getQuery = function getQuery() {
    return this.url;
};

module.exports = BaseFetch;
