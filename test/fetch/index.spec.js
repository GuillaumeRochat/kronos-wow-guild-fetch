var expect = require('expect.js');
var nock = require('nock');

var Fetch = require('_/fetch');

before(function() {
    nock.disableNetConnect();
});

describe('_/fetch', function() {
    it('returns a Promise when calling Guild', function() {
        nock('http://armory.twinstar.cz')
            .get('/guild-info.xml')
            .query({ r: 'realm', gn: 'guildName' })
            .reply(200, 'ok');

        var characters = Fetch.GetCharacters('realm', 'guildName');
        expect(characters.then).to.be.a('function');
    });
});

