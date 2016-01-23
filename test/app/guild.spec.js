var expect = require('expect.js');
var sinon = require('sinon');

var Promise = require('_/app/node_modules/bluebird');

var Guild = require('_/app/guild');
var Fetch = require('_/fetch');
var GuildConnection = require('_/app/guild-connection');

var Character = require('_/models/character');
var Profession = require('_/models/profession');
var Reputation = require('_/models/reputation');
var Activity = require('_/models/activity');

const REALM = 'realm';
const GUILD_NAME = 'guildName';

describe('_/app/guild', function() {
    describe('constuctor', function() {
        it('fails to instanciate if no realm string provided', function() {
            var closure = function() {
                new Guild();
            };

            expect(closure).to.throwError();
        });

        it('fails to instanciate if no guildName string provided', function() {
            var closure = function() {
                new Guild(REALM);
            };

            expect(closure).to.throwError();
        });

        it('fails to instanciate if no GuildConnection object provided', function() {
            var closure = function() {
                new Guild(REALM, GUILD_NAME);
            };

            expect(closure).to.throwError();
        });
    });

    describe('run', function() {
        var getCharactersStub;
        var getProfessionsStub;
        var getReputationsStub;
        var getActivitiesStub;
        var guildConnection;
        var guildConnectionStub;

        beforeEach(function() {
            getCharactersStub = stubGetCharacters();
            getProfessionsStub = stubGetProfessions();
            getReputationsStub = stubGetReputations();
            getActivitiesStub = stubGetActivities();
            guildConnection = new GuildConnection();
            guildConnectionMock = sinon.mock(guildConnection);
        });

        afterEach(function() {
            getCharactersStub.restore();
            getProfessionsStub.restore();
            getReputationsStub.restore();
            getActivitiesStub.restore();
            guildConnectionMock.restore();
        });

        it('fetches all the characters and save them when calling run', function() {
            var guild = new Guild(REALM, GUILD_NAME, guildConnection);
            guildConnectionMock.expects('saveCharacter').twice();

            return guild.run().then(function() {
                expect(getCharactersStub.calledOnce).to.be(true);
                guildConnectionMock.verify();
            });
        });

        it('fetches all the characters\' professions and save them when calling run', function() {
            var guild = new Guild(REALM, GUILD_NAME, guildConnection);
            guildConnectionMock.expects('saveProfession').exactly(4);

            return guild.run().then(function() {
                expect(getProfessionsStub.calledTwice).to.be(true);
                guildConnectionMock.verify();
            });
        });

        it('fetches all the characters\' reputations and save them when calling run', function() {
            var guild = new Guild(REALM, GUILD_NAME, guildConnection);
            guildConnectionMock.expects('saveReputation').exactly(4);

            return guild.run().then(function() {
                expect(getReputationsStub.calledTwice).to.be(true);
                guildConnectionMock.verify();
            });
        });

        it('fetches all the characters\' activities and save them when calling run', function() {
            var guild = new Guild(REALM, GUILD_NAME, guildConnection);
            guildConnectionMock.expects('saveActivity').exactly(4);

            return guild.run().then(function() {
                expect(getActivitiesStub.calledTwice).to.be(true);
                guildConnectionMock.verify();
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

