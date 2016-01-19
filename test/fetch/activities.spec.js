var expect = require('expect.js');
var sinon = require('sinon');
var nock = require('nock');

var Activity = require('_/models/activity');
var Activities = require('_/fetch/activities');

const URL = 'http://example.com';
const REALM = 'realm';
const CHARACTER_NAME = 'characterName';
const REPLY = `
<?xml version="1.0" encoding="UTF-8"?>
<feed today="31.12.2015" yesterday="Dec 30, 2015" time="00:00:00" v="0.8">
    <event type="bosskill" date="31.12.2015" time="12:12:12" id="14510" points="0" sort="earlier">
        <character name="Charactername" characterUrl="r=Realm&amp;cn=Charactername"/>
        <desc>Killed boss [<a href="https://vanilla-twinhead.twinstar.cz/?npc=14510"><span class="boss">BossName</span></a>][<a href="https://vanilla-twinhead.twinstar.cz/?boss-kill=123456"><span class="boss">detail</span></a>]</desc>
    </event>
    <event type="loot" date="31.12.2015" time="21:21:21" icon="inv_misc_cape_19" id="22337" slot="-1" sort="earlier">
        <character name="Charactername" characterUrl="r=Realm&amp;cn=Charactername"/>
    </event>
</feed>
`;

before(function() {
    nock.disableNetConnect();
});

beforeEach(function() {
    nock(URL)
        .get('/character-feed-data.xml')
        .query({ r: REALM, cn: CHARACTER_NAME, full: 'true' })
        .reply(200, REPLY);
});

afterEach(function() {
    nock.cleanAll();
});

describe('_/fetch/activities', function() {
    it('throws exception if URL, realm and characterName is not string', function() {
        var closure = function() {
            var activities = new Activities(1, 2, 3);
        };

        expect(closure).to.throwError();
    });

    it('sets the url, realm and characterName', function() {
        var activities = new Activities(URL, REALM, CHARACTER_NAME);

        expect(activities.url).to.be(URL);
        expect(activities.realm).to.be(REALM);
        expect(activities.characterName).to.be(CHARACTER_NAME);
    });

    it('replaces the realm spaces with + signs in getQuery', function() {
        var activities = new Activities(URL, 'realm name with spaces', CHARACTER_NAME);

        var query = activities.getQuery();

        expect(query).to.be(URL + '/character-feed-data.xml?r=realm+name+with+spaces&cn=' + CHARACTER_NAME + '&full=true');
    });

    it('returns an array of Activity objects when calling parse', function() {
        var activities = new Activities(URL, REALM, CHARACTER_NAME);

        var activitiesData = activities.parse(REPLY);

        expect(activitiesData).to.be.an('array');
        expect(activitiesData.length).to.be.greaterThan(0);
        activitiesData.forEach(function(activity) {
            expect(activity).to.be.an(Activity);
        });
    });

    it('sets the type of the activity from the node in the model', function() {
        var activities = new Activities(URL, REALM, CHARACTER_NAME);

        var activitiesData = activities.parse(REPLY);

        expect(activitiesData[0].get('type')).to.be('bosskill');
        expect(activitiesData[1].get('type')).to.be('loot');
    });

    it('sets the id of the activity from the node in the model', function() {
        var activities = new Activities(URL, REALM, CHARACTER_NAME);

        var activitiesData = activities.parse(REPLY);

        expect(activitiesData[0].get('id')).to.be(14510);
        expect(activitiesData[1].get('id')).to.be(22337);
    });

    it('sets the character name provided in the search in the model in lower case', function() {
        var activities = new Activities(URL, REALM, CHARACTER_NAME);

        var activitiesData = activities.parse(REPLY);

        expect(activitiesData[0].get('characterName')).to.be(CHARACTER_NAME.toLowerCase());
    });

    it('sets the bossKillID provided in the search in the model', function() {
        var activities = new Activities(URL, REALM, CHARACTER_NAME);

        var activitiesData = activities.parse(REPLY);

        expect(activitiesData[0].get('bossKillID')).to.be(123456);
        expect(activitiesData[1].get('bossKillID')).to.be(null);
    });

    it('sets the datetime from the node in the model in ISO-8601 UTC', function() {
        var activities = new Activities(URL, REALM, CHARACTER_NAME);

        var activitiesData = activities.parse(REPLY);

        expect(activitiesData[0].get('datetime')).to.be('2015-12-31T11:12:12Z');
    });
});

