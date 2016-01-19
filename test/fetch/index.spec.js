var expect = require('expect.js');
var nock = require('nock');

var Fetch = require('_/fetch');

const URL = 'http://armory.twinstar.cz';
const REALM = 'realm';
const GUILD_NAME = 'guildName';
const CHARACTER_NAME = 'characterName';
const REPLY = 'reply';

before(function() {
    nock.disableNetConnect();
});

describe('_/fetch', function() {
    it('throws exception if realm name is not string', function() {
        var closure = function() {
            var fetch = new Fetch(1);
        };

        expect(closure).to.throwError();
    });

    it('sets the realm', function() {
        var fetch = new Fetch(REALM);

        expect(fetch.realm).to.be(REALM);
    });

    it('returns a Promise when calling getCharacters', function() {
        nock(URL)
            .get('/guild-info.xml')
            .query({ r: REALM, gn: GUILD_NAME })
            .reply(200, REPLY);
        var fetch = new Fetch(REALM);

        var characters = fetch.getCharacters(GUILD_NAME);

        expect(characters.then).to.be.a('function');
    });

    it('returns a Promise when calling getProfessions', function() {
        nock(URL)
            .get('/character-sheet.xml')
            .query({ r: REALM, cn: CHARACTER_NAME })
            .reply(200, REPLY);
        var fetch = new Fetch(REALM);

        var professions = fetch.getProfessions(CHARACTER_NAME);

        expect(professions.then).to.be.a('function');
    });

    it('returns a Promise when calling getReputations', function() {
        nock(URL)
            .get('/character-reputation.xml')
            .query({ r: REALM, cn: CHARACTER_NAME })
            .reply(200, REPLY);
        var fetch = new Fetch(REALM);

        var reputations = fetch.getReputations(CHARACTER_NAME);

        expect(reputations.then).to.be.a('function');
    });

    it('returns a Promise when calling getActivities', function() {
        nock(URL)
            .get('/character-feed-data.xml')
            .query({ r: REALM, cn: CHARACTER_NAME, full: 'true' })
            .reply(200, REPLY);
        var fetch = new Fetch(REALM);

        var activities = fetch.getActivities(CHARACTER_NAME);

        expect(activities.then).to.be.a('function');
    });
});

