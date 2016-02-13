var expect = require('expect.js');
var sinon = require('sinon');

var _ = require('lodash');
var moment = require('moment');
var Promise = require('_/app/node_modules/bluebird');
var Firebase = require('_/app/node_modules/firebase');
var GuildRepository = require('_/app/guild-repository');

var Character = require('_/models/character');
var Profession = require('_/models/profession');
var Reputation = require('_/models/reputation');
var Activity = require('_/models/activity');

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
            var removedData = _.extend({ dateRemoved: moment.utc().format('YYYY-MM-DD') }, _.omit(getSavedCharacters().val().characterTwo, 'dateAdded'));
            firebaseMock.expects('set').once().withArgs(removedData).returns(Promise.resolve(true));

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

    var firebase;
    var firebaseMock;

    beforeEach(function() {
        firebase = new Firebase(FIREBASE_URL);
        firebaseMock = sinon.mock(firebase);
        firebaseMock.expects('getAuth').returns(true);
        firebaseMock.expects('child').atLeast(0).returns(firebase);
    });

    afterEach(function() {
        firebaseMock.restore();
    });

    it('adds a new character with the current date as date added', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('once').once().returns(Promise.resolve(getEmptyNodePayload()));
        firebaseMock.expects('set').once().withArgs(getNewCharacterToSavePayload()).returns(Promise.resolve(true));

        return guildRepository.saveCharacter(getFetchedCharacters()[1]).then(function() {
            firebaseMock.verify();
        });
    });

    it('updates an existing character level, race and gender', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('once').once().returns(Promise.resolve(getExistingCharacterSavedPayload()));
        firebaseMock.expects('update').once().withArgs(getExistingCharacterToUpdatePayload()).returns(Promise.resolve(true));

        return guildRepository.saveCharacter(getFetchedCharacters()[0]).then(function() {
            firebaseMock.verify();
        });
    });


    it('adds and updates professions', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('child').once().withArgs('professions/mining/characterOne').returns(firebase);
        firebaseMock.expects('set').once().withArgs(300).returns(Promise.resolve(true));

        return guildRepository.saveProfession(getFetchedProfessions()[0]).then(function() {
            firebaseMock.verify();
        });
    });


    it('removes saved professions that the character no longer has', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('child').never().withArgs('professions/mining/characterOne').returns(firebase);
        firebaseMock.expects('child').never().withArgs('professions/skinning/characterOne').returns(firebase);
        firebaseMock.expects('child').once().withArgs('professions/herbalism/characterOne').returns(firebase);
        firebaseMock.expects('once').atLeast(1).returns(Promise.resolve(getExistingProfessionSavedPayload()));
        firebaseMock.expects('remove').atLeast(1).returns(Promise.resolve(true));

        return guildRepository.cleanRemovedProfessions('characterOne', getFetchedProfessions()).then(function() {
            firebaseMock.verify();
        });
    });


    it('adds and updates reputations', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('child').once().withArgs('reputations/stormwind/characterOne').returns(firebase);
        firebaseMock.expects('set').once().withArgs(42000).returns(Promise.resolve(true));

        return guildRepository.saveReputation(getFetchedReputations()[0]).then(function() {
            firebaseMock.verify();
        });
    });


    it('adds new bosskill activities in bosskills', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('child').once().withArgs('bosskills/characterOne/456').returns(firebase);
        firebaseMock.expects('once').once().returns(Promise.resolve(getEmptyNodePayload()));
        firebaseMock.expects('set').once().withArgs(getNewBosskillsToPushPayload()).returns(Promise.resolve(true));

        return guildRepository.saveActivity(getFetchedActivities()[0]).then(function() {
            firebaseMock.verify();
        });
    });

    it('does not set existing bosskill activities in bosskills', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('child').once().withArgs('bosskills/characterOne/456').returns(firebase);
        firebaseMock.expects('once').once().returns(Promise.resolve(getExistingBosskillSavedPayload()));
        firebaseMock.expects('set').never();

        return guildRepository.saveActivity(getFetchedActivities()[0]).then(function() {
            firebaseMock.verify();
        });
    });

    it('adds new item activities in items', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('child').once().withArgs('items/characterOne/123').returns(firebase);
        firebaseMock.expects('once').once().returns(Promise.resolve(getEmptyNodePayload()));
        firebaseMock.expects('set').once().withArgs(['2015-12-31T00:00:00+00:00']).returns(Promise.resolve(true));

        return guildRepository.saveActivity(getFetchedActivities()[1]).then(function() {
            firebaseMock.verify();
        });
    });

    it('does not add existing item activities in items', function() {
        var guildRepository = new GuildRepository(firebase);
        firebaseMock.expects('child').once().withArgs('items/characterOne/123').returns(firebase);
        firebaseMock.expects('once').once().returns(Promise.resolve(getExistingItemSavedPayload()));
        firebaseMock.expects('set').never();

        return guildRepository.saveActivity(getFetchedActivities()[1]).then(function() {
            firebaseMock.verify();
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
        guildRank: 0,
        dateAdded: '2015-12-31'
    };

    var characterTwo = {
        class: 'paladin',
        race: 'dwarf',
        gender: 'female',
        level: 30,
        guildRank: 1,
        dateAdded: '2015-12-31'
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

    var characterThree = new Character();
    characterThree.setName('characterThree');
    characterThree.setClass('mage');
    characterThree.setRace('gnome');
    characterThree.setGender('male');
    characterThree.setLevel(45);
    characterThree.setGuildRank(2);

    return [characterOne, characterThree];
}

function getNewCharacterToSavePayload() {
    return {
        class: 'mage',
        race: 'gnome',
        gender: 'male',
        level: 45,
        guildRank: 2,
        dateAdded: moment.utc().format('YYYY-MM-DD')
    };
}

function getEmptyNodePayload() {
    var val = sinon.stub();

    val.returns(null);

    return { val };
}

function getExistingCharacterToUpdatePayload() {
    return {
        class: 'warrior',
        race: 'human',
        gender: 'male',
        level: 60,
        guildRank: 0
    };
}

function getExistingCharacterSavedPayload() {
    var val = sinon.stub();

    val.returns({
        class: 'warrior',
        race: 'human',
        gender: 'male',
        level: 60,
        guildRank: 0
    });

    return { val };
}

function getFetchedProfessions() {
    var professionOne = new Profession();
    professionOne.setName('mining');
    professionOne.setCharacterName('characterOne');
    professionOne.setLevel(300);

    var professionTwo = new Profession();
    professionTwo.setName('skinning');
    professionTwo.setCharacterName('characterOne');
    professionTwo.setLevel(300);

    return [professionOne, professionTwo];
}

function getExistingProfessionSavedPayload() {
    var val = sinon.stub();

    val.returns(300);

    return { val };
}

function getFetchedReputations() {
    var reputationOne = new Reputation();
    reputationOne.setName('stormwind');
    reputationOne.setCharacterName('characterOne');
    reputationOne.setLevel(42000);
    return [reputationOne];
}

function getNewBosskillsToPushPayload() {
    return {
        bossID: 123,
        dateKilled: '2015-12-31T00:00:00+00:00'
    };
}

function getFetchedActivities() {
    var activityOne = new Activity();
    activityOne.setType('bosskill');
    activityOne.setID(123);
    activityOne.setCharacterName('characterOne');
    activityOne.setBosskillID(456);
    activityOne.setDatetime('2015-12-31T00:00:00+00:00');

    var activityTwo = new Activity();
    activityTwo.setType('loot');
    activityTwo.setID(123);
    activityTwo.setCharacterName('characterOne');
    activityTwo.setDatetime('2015-12-31T00:00:00+00:00');

    return [activityOne, activityTwo];
}

function getExistingBosskillSavedPayload() {
    var val = sinon.stub();

    val.returns({
        bossID: 123,
        dateKilled: '2015-12-31T00:00:00+00:00'
    });

    return { val };
}

function getExistingItemSavedPayload() {
    var val = sinon.stub();

    val.returns(['2015-12-31T00:00:00+00:00']);

    return { val };
}
