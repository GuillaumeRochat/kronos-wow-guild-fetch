var expect = require('expect.js');
var sinon = require('sinon');
var nock = require('nock');

var Character = require('_/models/character');
var Characters = require('_/fetch/characters');

const URL = 'http://example.com';
const REALM = 'realm';
const GUILD_NAME = 'guildName';
const REPLY = `
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="_layout/guild/roster.xsl"?>
<page globalSearch="1" lang="en_gb" version="585" requestUrl="guild-info.xml" datadiscId="1">
    <tabInfo subTab="guildRoster" tab="guild" tabGroup="guild" tabUrl="r=realm&amp;gn=Guildname"/>
    <guildInfo>
        <guildHeader battleGroup="Twinstar.cz" count="2" faction="1" name="Guildname" level="0" nameUrl="r=realm&amp;gn=Guildname" realm="realm" realmUrl="realm" url="r=realm&amp;gn=Guildname">
            <emblem emblemBackground="1" emblemBorderColor="1" emblemBorderStyle="1" emblemIconColor="1" emblemIconStyle="1"/>
        </guildHeader>
        <guild>
            <members minLevel="19" maxLevel="60" memberCount="2">
                <character guid="1" name="Nameone" classId="1" raceId="1" genderId="0" level="60" rank="0" achPoints="0" url="r=realm&amp;cn=Nameone&amp;gn=Guildname"/>
                <character guid="2" name="Nametwo" classId="2" raceId="2" genderId="1" level="1" rank="1" achPoints="0" url="r=realm&amp;cn=Nametwo&amp;gn=Guildname"/>
            </members>
        </guild>
    </guildInfo>
</page>
`;

before(function() {
    nock.disableNetConnect();
});

beforeEach(function() {
   nock(URL)
       .get('/guild-info.xml')
       .query({ r: REALM, gn: GUILD_NAME })
       .reply(200, REPLY);
});

afterEach(function() {
    nock.cleanAll();
});

describe('_/fetch/characters', function() {
    it('throw exception if URL, realm or guildName is not string', function() {
        var closure = function() {
            var characters = new Characters(1, 2, 3);
        };

        expect(closure).to.throwError();
    });

    it('sets the url, realm and guildName', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        expect(characters.url).to.be(URL);
        expect(characters.realm).to.be(REALM);
        expect(characters.guildName).to.be(GUILD_NAME);
    });

    it('calls the fetch function when calling getData', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);
        var spy = sinon.spy(characters, 'fetch');

        return characters.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('calls the parse function when calling getData', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);
        var spy = sinon.spy(characters, 'parse');

        return characters.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('replaces the guildName spaces with + signs in getQuery', function() {
        var characters = new Characters(URL, REALM, 'guild name with spaces');

        var query = characters.getQuery();

        expect(query).to.be(URL + '/guild-info.xml?r=' + REALM + '&gn=guild+name+with+spaces');
    });

    it('replaces the realm spaces with + signs in getQuery', function() {
        var characters = new Characters(URL, 'realm name with spaces', GUILD_NAME);

        var query = characters.getQuery();

        expect(query).to.be(URL + '/guild-info.xml?r=realm+name+with+spaces&gn=' + GUILD_NAME);
    });

    it('performs the request of the query', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        return characters.fetch().then(function(response) {
            expect(response).to.be(REPLY);
        });
    });

    it('returns an array of Character objects', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var characterData = characters.parse(REPLY);

        expect(characterData).to.be.an('array');
        expect(characterData).to.have.length(2);
        characterData.forEach(function(character) {
            expect(character).to.be.a(Character);
        });
    });

    it('sets the character name from the node in the model', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var charactersData = characters.parse(REPLY);

        expect(charactersData[0].get('name')).to.be('Nameone');
        expect(charactersData[1].get('name')).to.be('Nametwo');
    });

    it('sets the character class from the node in the model', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var charactersData = characters.parse(REPLY);

        expect(charactersData[0].get('class')).to.be('warrior');
        expect(charactersData[1].get('class')).to.be('paladin');
    });

    it('sets the character race from the node in the model', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var charactersData = characters.parse(REPLY);

        expect(charactersData[0].get('race')).to.be('human');
        expect(charactersData[1].get('race')).to.be('orc');
    });

    it('sets the character level from the node in the model', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var charactersData = characters.parse(REPLY);

        expect(charactersData[0].get('level')).to.be(60);
        expect(charactersData[1].get('level')).to.be(1);
    });

    it('sets the character guild rank from the node in the model', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var charactersData = characters.parse(REPLY);

        expect(charactersData[0].get('guildRank')).to.be(0);
        expect(charactersData[1].get('guildRank')).to.be(1);
    });

    it('returns null if class id is not found', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var className = characters.getClass(100);

        expect(className).to.be(null);
    });

    it('returns the class name corresponding to the id', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var warrior = characters.getClass(1);
        var paladin = characters.getClass(2);

        expect(warrior).to.be('warrior');
        expect(paladin).to.be('paladin');
    });

    it('returns null if race id is not found', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var raceName = characters.getRace(100);

        expect(raceName).to.be(null);
    });

    it('returns the race name corresponding to the id', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var human = characters.getRace(1);
        var orc = characters.getRace(2);

        expect(human).to.be('human');
        expect(orc).to.be('orc');
    });

    it('returns null if gender id is not found', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var genderName = characters.getGender(100);

        expect(genderName).to.be(null);
    });

    it('returns the gender name corresponding to the id', function() {
        var characters = new Characters(URL, REALM, GUILD_NAME);

        var male = characters.getGender(0);
        var female = characters.getGender(1);

        expect(male).to.be('male');
        expect(female).to.be('female');
    });
});

