var expect = require('expect.js');
var sinon = require('sinon');

var Promise = require('_/app/node_modules/bluebird');
var Firebase = require('_/app/node_modules/firebase');
var GuildRepository = require('_/app/guild-repository');

var Character = require('_/models/character');

const FIREBASE_URL = 'https://example.firebaseio-demo.com';

describe('_/app/guild-repository', function() {
    describe('constructor', function() {
        it('fails to instanciate if no Firebase connection provided', function() {
            var closure = function() {
                new GuildRepository();
            };

            expect(closure).to.throwError();
        });

        it('fails to instanciate if firebase is not authentified', function() {
            var closure = function() {
                var firebase = new Firebase(FIREBASE_URL);
                var firebaseMock = sinon.mock(firebase);
                new GuildRepository(firebase);
            };

            expect(closure).to.throwError();
        });
    });

    describe('cleanRemovedCharacters', function() {
        var firebase;
        var firebaseMock;

        beforeEach(function() {
            firebase = new Firebase(FIREBASE_URL);
            firebaseMock = sinon.mock(firebase);
            firebaseMock.expects('getAuth').returns(true);
       });

        afterEach(function() {
            firebaseMock.restore();
        });

        it('removes the characters from members that are in firebase but not in the provided list', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('child').once().withArgs('members').returns(firebase);
            firebaseMock.expects('once').once().withArgs('value').returns(Promise.resolve(getSavedCharacters()));
            firebaseMock.expects('child').once().withArgs('members/characterTwo').returns(firebase);
            firebaseMock.expects('child').withArgs('ex-members/characterTwo').returns(firebase);
            firebaseMock.expects('remove').once().returns(Promise.resolve(true));

            return guildRepository.cleanRemovedCharacters(getFetchedCharacters()).then(function() {
                firebaseMock.verify();
            });
        });

        it('places the removed characters in ex-members', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('child').withArgs('members').returns(firebase);
            firebaseMock.expects('once').withArgs('value').returns(Promise.resolve(getSavedCharacters()));
            firebaseMock.expects('child').withArgs('members/characterTwo').returns(firebase);
            firebaseMock.expects('child').once().withArgs('ex-members/characterTwo').returns(firebase);
            firebaseMock.expects('remove').once().returns(Promise.resolve(true));
            firebaseMock.expects('set').once().withArgs(getSavedCharacters().val().characterTwo);

            return guildRepository.cleanRemovedCharacters(getFetchedCharacters()).then(function() {
                firebaseMock.verify();
            });
        });
    });
});

function getSavedCharacters() {
    var val = sinon.stub();

    var characterOne = {
        class: 'warrior',
        race: 'human',
        gender: 'male',
        level: 60,
        guildRank: 0
    };

    var characterTwo = {
        class: 'paladin',
        race: 'dwarf',
        gender: 'female',
        level: 30,
        guildRank: 1
    };

    val.returns({ characterOne: characterOne, characterTwo: characterTwo });

    return { val };
}

function getFetchedCharacters() {
    var characterOne = new Character();
    characterOne.setName('characterOne');
    characterOne.setClass('warrior');
    characterOne.setRace('human');
    characterOne.setGender('male');
    characterOne.setLevel(60);
    characterOne.setGuildRank(0);

    return [characterOne];
}

