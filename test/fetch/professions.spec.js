var expect = require('expect.js');
var sinon = require('sinon');
var nock = require('nock');

var Profession = require('_/models/profession');
var Professions = require('_/fetch/professions');

const URL = 'http://example.com';
const REALM = 'realm';
const CHARACTER_NAME = 'characterName';
const REPLY = `
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="_layout/character/sheet.xsl"?>
<page globalSearch="1" lang="en_gb" version="585" requestUrl="character-sheet.xml" datadiscId="1">
    <tabInfo subTab="profile" tab="character" tabGroup="character" tabUrl="r=Realm&amp;cn=Charactername&amp;gn=Guildname"/>
    <characterInfo>
        <characterTab>
            <professions>
                <skill id="164" name="Blacksmithing" value="300" key="blacksmithing" max="300"/>
                <skill id="186" name="Mining" value="300" key="mining" max="300"/>
            </professions>
            <skills>
                <skill id="129" name="First Aid" skill="1"/>
                <skill id="185" name="Cooking" skill="1"/>
                <skill id="356" name="Fishing" skill="0"/>
                <skill id="762" name="Riding" skill="75"/>
            </skills>
        </characterTab>
    </characterInfo>
</page>
`;

before(function() {
    nock.disableNetConnect();
});

beforeEach(function() {
    nock(URL)
        .get('/character-sheet.xml')
        .query({ r: REALM, cn: CHARACTER_NAME })
        .reply(200, REPLY);
});

afterEach(function() {
    nock.cleanAll();
});

describe('_/fetch/professions', function() {
    it('throws exception if URL, realm or characterName is not string', function() {
        var closure = function() {
            var professions = new Professions(1, 2, 3);
        };

        expect(closure).to.throwError();
    });

    it('sets the url, realm and characterName', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        expect(professions.url).to.be(URL);
        expect(professions.realm).to.be(REALM);
        expect(professions.characterName).to.be(CHARACTER_NAME);
    });

    it('calls the fetch function when calling getData', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);
        var spy = sinon.spy(professions, 'fetch');

        return professions.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('calls the parse function when calling getData', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);
        var spy = sinon.spy(professions, 'parse');

        return professions.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('replaces the realm spaces with + signs in getQuery', function() {
        var professions = new Professions(URL, 'realm name with spaces', CHARACTER_NAME);

        var query = professions.getQuery();

        expect(query).to.be(URL + '/character-sheet.xml?r=realm+name+with+spaces&cn=' + CHARACTER_NAME);
    });

    it('performs the request of the query when calling fetch', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        return professions.fetch().then(function(response) {
            expect(response).to.be(REPLY);
        });
    });

    it('returns an array of Profession objects when calling parse', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        var professionsData = professions.parse(REPLY);

        expect(professionsData).to.be.an('array');
        expect(professionsData.length).to.be.greaterThan(0);
        professionsData.forEach(function(profession) {
            expect(profession).to.be.a(Profession);
        });
    });

    it('sets the primary profession name in lower case from the node in the model', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        var professionsData = professions.parse(REPLY);

        expect(professionsData[0].get('name')).to.be('blacksmithing');
        expect(professionsData[1].get('name')).to.be('mining');
    });

    it('sets the secondary profession name in lower case from the node in the model', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        var professionsData = professions.parse(REPLY);

        expect(professionsData[2].get('name')).to.be('first aid');
        expect(professionsData[3].get('name')).to.be('cooking');
    });

    it('does not add secondary profession with skill of 0', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        var professionsData = professions.parse(REPLY);

        expect(professionsData).to.have.length(5);
        professionsData.forEach(function(profession) {
            expect(profession.get('name')).to.not.be('fishing');
        });
    });

    it('sets the character name provided in the search in the model', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        var professionsData = professions.parse(REPLY);

        professionsData.forEach(function(profession) {
            expect(profession.get('characterName')).to.be(CHARACTER_NAME);
        });
    });

    it('sets the profession leve from the node in the model', function() {
        var professions = new Professions(URL, REALM, CHARACTER_NAME);

        var professionsData = professions.parse(REPLY);

        expect(professionsData[0].get('level')).to.be(300);
        expect(professionsData[1].get('level')).to.be(300);
        expect(professionsData[2].get('level')).to.be(1);
        expect(professionsData[3].get('level')).to.be(1);
        expect(professionsData[4].get('level')).to.be(75);
    });
});

