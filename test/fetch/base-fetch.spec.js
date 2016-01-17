var expect = require('expect.js');
var sinon = require('sinon');
var nock = require('nock');

var BaseFetch = require('_/fetch/base-fetch');

const URL = 'http://example.com';
const REALM = 'realm';
const REPLY = 'reply';

before(function() {
    nock.disableNetConnect();
});

beforeEach(function() {
    nock(URL)
        .get('/')
        .reply(200, REPLY);
});

describe('_/fetch/base-fetch', function() {
    it('throws exception if URL and realm is not string', function() {
        var closure = function() {
            var baseFetch = new BaseFetch(1, 2);
        };

        expect(closure).to.throwError();
    });

    it('sets the url and realm', function() {
        var baseFetch = new BaseFetch(URL, REALM);

        expect(baseFetch.url).to.be(URL);
        expect(baseFetch.realm).to.be(REALM);
    });

    it('calls the fetch function when calling getData', function() {
        var baseFetch = new BaseFetch(URL, REALM);
        var spy = sinon.spy(baseFetch, 'fetch');

        return baseFetch.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('calls the parse function when calling getData', function() {
        var baseFetch = new BaseFetch(URL, REALM);
        var spy = sinon.spy(baseFetch, 'parse');

        return baseFetch.getData().then(function() {
            expect(spy.calledOnce).to.be(true);
        });
    });

    it('performs the request of the query when calling fetch', function() {
        var baseFetch = new BaseFetch(URL, REALM);

        return baseFetch.fetch().then(function(response) {
            expect(response).to.be(REPLY);
        });
    });
});
