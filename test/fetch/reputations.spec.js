var expect = require('expect.js');
var sinon = require('sinon');
var nock = require('nock');

var Reputation = require('_/models/reputation');
var Reputations = require('_/fetch/reputations');

const URL = 'http://example.com';
const REALM = 'realm';
const CHARACTER_NAME = 'characterName';
const REPLY = `
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="_layout/character/reputation.xsl"?>
<page globalSearch="1" lang="en_gb" version="585" requestUrl="character-reputation.xml" datadiscId="1">
    <tabInfo subTab="reputation" tab="character" tabGroup="character" tabUrl="r=Realm&amp;cn=Charactername&amp;gn=Guildname"/>
    <characterInfo>
        <reputationTab>
            <faction header="1" iconKey="classic" id="1118" key="classic" name="World of Warcraft">
                <faction id="68" name="Undercity" reputation="21000"/>
                <faction id="76" name="Orgrimmar" reputation="42000"/>
                <faction id="81" name="Thunder Bluff" reputation="-10000"/>
            </faction>
        </reputationTab>
    </characterInfo>
</page>
`;

before(function() {
    nock.disableNetConnect();
});

beforeEach(function() {
    nock(URL)
        .get('/character-reputation.xml')
        .query({ r: REALM, cn: CHARACTER_NAME })
        .reply(200, REPLY);
});

afterEach(function() {
    nock.cleanAll();
});

describe('_/fetch/reputations', function() {
    it('throws exception if URL, realm or characterName is not string', function() {
        var closure = function() {
            var reputations = new Reputations(1, 2, 3);
        };

        expect(closure).to.throwError();
    });

    it('sets the url, realm and characterName', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);

        expect(reputations.url).to.be(URL);
        expect(reputations.realm).to.be(REALM);
        expect(reputations.characterName).to.be(CHARACTER_NAME);
    });

    it('calls the fetch function when calling getData', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);
        var spy = sinon.spy(reputations, 'fetch');

        return reputations.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('calls the parse function when calling getData', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);
        var spy = sinon.spy(reputations, 'parse');

        return reputations.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('replaces the realm spaces with + signs in getQuery', function() {
        var reputations = new Reputations(URL, 'realm name with spaces', CHARACTER_NAME);

        var query = reputations.getQuery();

        expect(query).to.be(URL + '/character-reputation.xml?r=realm+name+with+spaces&cn=' + CHARACTER_NAME);
    });

    it('performs the request of the query when calling fetch', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);

        return reputations.fetch().then(function(response) {
            expect(response).to.be(REPLY);
        });
    });

    it('returns an array of Reputation objects when calling parse', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);

        var reputationsData = reputations.parse(REPLY);

        expect(reputationsData).to.be.an('array');
        expect(reputationsData.length).to.be.greaterThan(0);
        reputationsData.forEach(function(reputation) {
            expect(reputation).to.be.a(Reputation);
        });
    });

    it('sets the faction name in lower case from the node in the model', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);

        var reputationsData = reputations.parse(REPLY);

        expect(reputationsData[0].get('name')).to.be('undercity');
        expect(reputationsData[1].get('name')).to.be('orgrimmar');
        expect(reputationsData[2].get('name')).to.be('thunder bluff');
    });

    it('sets the character name provided in the search of the model in lower case', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);

        var reputationsData = reputations.parse(REPLY);

        reputationsData.forEach(function(reputation) {
            expect(reputation.get('characterName')).to.be(CHARACTER_NAME.toLowerCase());
        });
    });

    it('sets the reputation level from the node in the model', function() {
        var reputations = new Reputations(URL, REALM, CHARACTER_NAME);

        var reputationsData = reputations.parse(REPLY);

        expect(reputationsData[0].get('level')).to.be(21000);
        expect(reputationsData[1].get('level')).to.be(42000);
        expect(reputationsData[2].get('level')).to.be(-10000);
    });
});

