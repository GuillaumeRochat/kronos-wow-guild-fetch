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
            firebaseMock.expects('child').atLeast(0).returns(firebase);
            firebaseMock.expects('once').exactly(3)
                .onCall(0).returns(Promise.resolve(getSavedCharacters()))
                .onCall(1).returns(Promise.resolve(getSavedProfessions()))
                .onCall(2).returns(Promise.resolve(getSavedReputations()));
            firebaseMock.expects('remove').atLeast(0).returns(Promise.resolve(true));
            firebaseMock.expects('set').atLeast(0).returns(Promise.resolve(true));
       });

        afterEach(function() {
            firebaseMock.restore();
        });

        it('removes the characters from characters that are in firebase but not in the provided list', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('child').once().withArgs('characters').returns(firebase);
            firebaseMock.expects('remove').atLeast(1).returns(Promise.resolve(true));

            return guildRepository.cleanRemovedCharacters(getFetchedCharacters()).then(function() {
                firebaseMock.verify();
            });
        });

        it('places the removed characters in ex-characters', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('set').once().withArgs(getSavedCharacters().val().characterTwo).returns(Promise.resolve(true));

            return guildRepository.cleanRemovedCharacters(getFetchedCharacters()).then(function() {
                firebaseMock.verify();
            });
        });

        it('removes the professions of the ex-characters', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('child').once().withArgs('professions').returns(firebase);
            firebaseMock.expects('child').once().withArgs('professions/mining/characterTwo').returns(firebase);
            firebaseMock.expects('remove').atLeast(1).returns(Promise.resolve(true));

            return guildRepository.cleanRemovedCharacters(getFetchedCharacters()).then(function() {
                firebaseMock.verify();
            });
        });

        it('removes the reputations of the ex-characters', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('child').once().withArgs('reputations').returns(firebase);
            firebaseMock.expects('child').once().withArgs('reputations/stormwind/characterTwo').returns(firebase);
            firebaseMock.expects('remove').atLeast(1).returns(Promise.resolve(true));

            return guildRepository.cleanRemovedCharacters(getFetchedCharacters()).then(function() {
                firebaseMock.verify();
            });
        });

        it('removes the items of the ex-characters', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('child').once().withArgs('items/characterTwo').returns(firebase);
            firebaseMock.expects('remove').atLeast(1).returns(Promise.resolve(true));

            return guildRepository.cleanRemovedCharacters(getFetchedCharacters()).then(function() {
                firebaseMock.verify();
            });
        });

        it('removes the bosskills of the ex-characters', function() {
            var guildRepository = new GuildRepository(firebase);
            firebaseMock.expects('child').once().withArgs('bosskills/characterTwo').returns(firebase);
            firebaseMock.expects('remove').atLeast(1).returns(Promise.resolve(true));

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

function getSavedProfessions() {
    var val = sinon.stub();

    var mining = {
        characterOne: 300,
        characterTwo: 300
    };

    var skinning = {
        characterOne: 300,
        characterTwo: 300
    };

    val.returns({ mining: mining, skinning: skinning });

    return { val };
}

function getSavedReputations() {
    var val = sinon.stub();

    var stormwind = {
        characterOne: 42000,
        characterTwo: 21000
    };

    var ironforge = {
        characterOne: 42000,
        characterTwo: 21000
    };

    val.returns({ stormwind: stormwind, ironforge: ironforge });

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

