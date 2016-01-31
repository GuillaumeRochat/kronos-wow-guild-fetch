var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');
var Firebase = require('firebase');

var GuildFetch = require('./guild-fetch');
var GuildRepository = require('./guild-repository');

/**
 * Instanciates the App.
 * @returns {object} An instance of App connected to  the tasks node in firebase.
 */
function App() {
    console.time('fullFetch');
    this.tasksRef = new Firebase('https://' + process.env.FIREBASE_SUBDOMAIN + '.firebaseio.com/tasks');
    this.tasksRef.authWithCustomToken(process.env.FIREBASE_AUTH).catch(function(error) {
        console.log('Error - Could not authenticate:', error);
        process.exit(1);
    });
}

/**
 * Runs through all the tasks to fetch the data.
 * @returns {object} A promise that resolves once all the tasks have been completed.
 */
App.prototype.run = function run() {
    var self = this;
    return this.tasksRef.once('value').then(function(savedRealms) {
        var realmNames = [];
        _.forIn(savedRealms.val(), function(guilds, realmName) {
            realmNames.push({ realmName: realmName, guilds: guilds });
        });

        return Promise.map(realmNames, function(realmTask) {
            return self.fetchGuilds(realmTask.realmName, realmTask.guilds);
        }, { concurrency: 1 });
    }).then(function() {
        console.timeEnd('fullFetch');
        process.exit(0);
    }).catch(function(error) {
        console.log('Something went wrong:', error);
        process.exit(1);
    });
};

/**
 * Fetches all the guilds for a specific realm.
 * @param {string} realmName The name of the realm to fetch.
 * @param {array} guilds An array of guilds to fetch.
 * @returns {object} A promise that resolves once all the guilds of the realm have been fetched.
 */
App.prototype.fetchGuilds = function fetchGuilds(realmName, guilds) {
    return Promise.map(guilds, function(guildName) {
        var guildFirebase = new Firebase('https://' + process.env.FIREBASE_SUBDOMAIN + '.firebaseio.com/guilds/' + guildName);
        guildFirebase.authWithCustomToken(process.env.FIREBASE_AUTH);

        var guildRepository = new GuildRepository(guildFirebase);
        var guildFetch = new GuildFetch(realmName, guildName, guildRepository);
        return guildFetch.run().then(function() {
            guildFirebase.child('lastUpdate').set(moment.utc().format('YYYY-MM-DDTHH:mm:ssZ'));
        });
    }, { concurrency: 1 });
};

module.exports = App;
