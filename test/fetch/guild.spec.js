var expect = require('expect.js');
var sinon = require('sinon');
var nock = require('nock');
var Guild = require('_/fetch/guild');

const URL = 'http://example.com';
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
                <character guid="1" name="Nameone" classId="1" raceId="1" genderId="1" level="60" rank="0" achPoints="0" url="r=realm&amp;cn=Nameone&amp;gn=Guildname"/>
                <character guid="2" name="Nametwo" classId="1" raceId="1" genderId="1" level="60" rank="1" achPoints="0" url="r=realm&amp;cn=Nametwo&amp;gn=Guildname"/>
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
       .query({ r: 'realm', gn: 'guildName' })
       .reply(200, REPLY);
});

afterEach(function() {
    nock.cleanAll();
});

describe('_/fetch/guild', function() {
    it('throws exception if no URL or guildName', function() {
        var closure = function() {
            var guild = new Guild();
        };

        expect(closure).to.throwError();
    });

    it('throw exception if URL or guildName is not string', function() {
        var closure = function() {
            var guild = new Guild(1, 2, 3);
        };

        expect(closure).to.throwError();
    });

    it('sets the url and guildName', function() {
        var guild = new Guild(URL, 'realm', 'guildName');

        expect(guild.url).to.be(URL);
        expect(guild.realm).to.be('realm');
        expect(guild.guildName).to.be('guildName');
    });

    it('calls the fetch function when calling getData', function() {
        var guild = new Guild(URL, 'realm', 'guildName');
        var spy = sinon.spy(guild, 'fetch');

        guild.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('calls the parse function when calling getData', function() {
        var guild = new Guild(URL, 'realm', 'guildName');
        var spy = sinon.spy(guild, 'parse');

        guild.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('replaces the guildName spaces with + signs in getQuery', function() {
        var guild = new Guild(URL, 'realm', 'guild name with spaces');

        expect(guild.getQuery()).to.be(URL + '/guild-info.xml?r=realm&gn=guild+name+with+spaces');
    });

    it('replaces the realm spaces with + signs in getQuery', function() {
        var guild = new Guild(URL, 'realm name with spaces', 'guildName');

        expect(guild.getQuery()).to.be(URL + '/guild-info.xml?r=realm+name+with+spaces&gn=guildName');
    });

    it('performs the request of the query', function() {
        var guild = new Guild(URL, 'realm', 'guildName');

        guild.fetch().then(function(response) {
            expect(response).to.be(REPLY);
        });
    });
});

