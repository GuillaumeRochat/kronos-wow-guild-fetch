var expect = require('expect.js');
var Reputation = require('_/models/reputation');

describe('_/models/reputation', function() {
    it('sets the name if valid', function() {
        var valid = new Reputation();
        var notValid = new Reputation();

        valid.setName('stormwind');
        notValid.setName('alliance');

        expect(valid.get('name')).to.be('stormwind');
        expect(notValid.get('name')).to.be(null);
    });

    it('sets the character name if not empty string', function() {
        var emptyString = new Reputation();
        var notEmptyString = new Reputation();
        var notString = new Reputation();

        emptyString.setCharacterName('');
        notEmptyString.setCharacterName('characterName');
        notString.setCharacterName(1);

        expect(emptyString.get('characterName')).to.be(null);
        expect(notEmptyString.get('characterName')).to.be('characterName');
        expect(notString.get('characterName')).to.be(null);
    });

    it('sets the level between -42000 and 42999', function() {
        var intBelow = new Reputation();
        var intLowest = new Reputation();
        var intHighest = new Reputation();
        var intAbove = new Reputation();
        var notInt = new Reputation();

        intBelow.setLevel(-42001);
        intLowest.setLevel(-42000);
        intHighest.setLevel(42999);
        intAbove.setLevel(43000);
        notInt.setLevel('level');

        expect(intBelow.get('level')).to.be(null);
        expect(intLowest.get('level')).to.be(-42000);
        expect(intHighest.get('level')).to.be(42999);
        expect(intAbove.get('level')).to.be(null);
        expect(notInt.get('level')).to.be(null);
    });
});

