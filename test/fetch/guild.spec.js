var expect = require('expect.js');
var sinon = require('sinon');
//var nock = require('nock');
var Guild = require('_/fetch/guild');

describe('_/fetch/guild', function() {
    it('throws exception if no URL or guildName', function() {
        var closure = function() {
            var guild = new Guild();
        };

        expect(closure).to.throwError();
    });

    it('throw exception if URL or guildName is not string', function() {
        var closure = function() {
            var guild = new Guild(1, 2);
        };

        expect(closure).to.throwError();
    });

    it('sets the url and guildName', function() {
        var guild = new Guild('url', 'guildName');

        expect(guild.url).to.be('url');
        expect(guild.guildName).to.be('guildName');
    });

    it('calls the request function when calling getData', function() {
        var guild = new Guild('url', 'guildName');
        var spy = sinon.spy(guild, 'request');

        guild.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('calls the parse function when calling getData', function() {
        var guild = new Guild('url', 'guildName');
        var spy = sinon.spy(guild, 'parse');

        guild.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('calls the result function when calling getData', function() {
        var guild = new Guild('url', 'guildName');
        var spy = sinon.spy(guild, 'results');

        guild.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });
});

