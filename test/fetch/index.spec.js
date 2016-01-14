var Promise = require('bluebird');
var expect = require('expect.js');
var Fetch = require('_/fetch');

describe('_/fetch', function() {
    it('returns a Promise when calling Guild', function() {
        var guild = Fetch.Guild('realm', 'guildName');
        expect(guild.then).to.be.a('function');
    });
});

