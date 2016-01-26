var expect = require('expect.js');
var sinon = require('sinon');

var Promise = require('_/app/node_modules/bluebird');

var GuildFetch = require('_/app/guild-fetch');
var Fetch = require('_/fetch');
var GuildRepository = require('_/app/guild-repository');

var Character = require('_/models/character');
var Profession = require('_/models/profession');
var Reputation = require('_/models/reputation');
var Activity = require('_/models/activity');

const REALM = 'realm';
const GUILD_NAME = 'guildName';

describe('_/app/guild-fetch', function() {
    describe('constuctor', function() {
        it('fails to instanciate if no realm string provided', function() {
            var closure = function() {
                new GuildFetch();
            };

            expect(closure).to.throwError();
        });

        it('fails to instanciate if no guildName string provided', function() {
            var closure = function() {
                new GuildFetch(REALM);
            };

            expect(closure).to.throwError();
        });

        it('fails to instanciate if no GuildRepository object provided', function() {
            var closure = function() {
                new GuildFetch(REALM, GUILD_NAME);
            };

            expect(closure).to.throwError();
        });
    });

    describe('run', function() {
        var getCharactersStub;
        var getProfessionsStub;
        var getReputationsStub;
        var getActivitiesStub;
        var guildRepository;
        var guildRepositoryStub;

        beforeEach(function() {
            getCharactersStub = stubGetCharacters();
            getProfessionsStub = stubGetProfessions();
            getReputationsStub = stubGetReputations();
            getActivitiesStub = stubGetActivities();
            guildRepository = new GuildRepository();
            guildRepositoryMock = sinon.mock(guildRepository);
        });

        afterEach(function() {
            getCharactersStub.restore();
            getProfessionsStub.restore();
            getReputationsStub.restore();
            getActivitiesStub.restore();
            guildRepositoryMock.restore();
        });

        it('fetches all the characters and save them when calling run', function() {
            var guildFetch = new GuildFetch(REALM, GUILD_NAME, guildRepository);
            guildRepositoryMock.expects('saveCharacter').twice();

            return guildFetch.run().then(function() {
                expect(getCharactersStub.calledOnce).to.be(true);
                guildRepositoryMock.verify();
            });
        });

        it('fetches all the characters and removes the one no longer present from the guild', function() {
            var guildFetch = new GuildFetch(REALM, GUILD_NAME, guildRepository);
            guildRepositoryMock.expects('cleanRemovedCharacters').once();

            return guildFetch.run().then(function() {
                guildRepositoryMock.verify();
            });
        });

        it('fetches all the characters\' professions and save them when calling run', function() {
            var guildFetch = new GuildFetch(REALM, GUILD_NAME, guildRepository);
            guildRepositoryMock.expects('saveProfession').exactly(4);

            return guildFetch.run().then(function() {
                expect(getProfessionsStub.calledTwice).to.be(true);
                guildRepositoryMock.verify();
            });
        });

        it('fetches all the characters\' professions and removes the profession the characters no longer have', function() {
            var guildFetch = new GuildFetch(REALM, GUILD_NAME, guildRepository);
            guildRepositoryMock.expects('cleanRemovedProfessions').twice();

            return guildFetch.run().then(function() {
                guildRepositoryMock.verify();
            });
        });

        it('fetches all the characters\' reputations and save them when calling run', function() {
            var guildFetch = new GuildFetch(REALM, GUILD_NAME, guildRepository);
            guildRepositoryMock.expects('saveReputation').exactly(4);

            return guildFetch.run().then(function() {
                expect(getReputationsStub.calledTwice).to.be(true);
                guildRepositoryMock.verify();
            });
        });

        it('fetches all the characters\' activities and save them when calling run', function() {
            var guildFetch = new GuildFetch(REALM, GUILD_NAME, guildRepository);
            guildRepositoryMock.expects('saveActivity').exactly(4);

            return guildFetch.run().then(function() {
                expect(getActivitiesStub.calledTwice).to.be(true);
                guildRepositoryMock.verify();
            });
        });
    });
});

function stubGetCharacters() {
    var stub = sinon.stub(Fetch.prototype, 'getCharacters');

    var characterOne = new Character();
    characterOne.setName('characterOne');
    var characterTwo = new Character();
    characterTwo.setName('characterTwo');
    stub.returns(Promise.resolve([characterOne, characterTwo]));

    return stub;
}

function stubGetProfessions() {
    var stub = sinon.stub(Fetch.prototype, 'getProfessions');

    var professionOne = new Profession();
    var professionTwo = new Profession();
    stub.withArgs('characterOne').returns(Promise.resolve([professionOne, professionTwo]));

    var professionThree = new Profession();
    var professionFour = new Profession();
    stub.withArgs('characterTwo').returns(Promise.resolve([professionThree, professionFour]));

    return stub;
}

function stubGetReputations() {
    var stub = sinon.stub(Fetch.prototype, 'getReputations');

    var reputationOne = new Reputation();
    var reputationTwo = new Reputation();
    stub.withArgs('characterOne').returns(Promise.resolve([reputationOne, reputationTwo]));

    var reputationThree = new Reputation();
    var reputationFour = new Reputation();
    stub.withArgs('characterTwo').returns(Promise.resolve([reputationThree, reputationFour]));

    return stub;
}

function stubGetActivities() {
    var stub = sinon.stub(Fetch.prototype, 'getActivities');

    var activityOne = new Activity();
    var activityTwo = new Activity();
    stub.withArgs('characterOne').returns(Promise.resolve([activityOne, activityTwo]));

    var activityThree = new Activity();
    var activityFour = new Activity();
    stub.withArgs('characterTwo').returns(Promise.resolve([activityThree, activityFour]));

    return stub;
}

