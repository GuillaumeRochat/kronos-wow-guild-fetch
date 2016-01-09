var expect = require('expect.js');
var Character = require('_/models/character');

describe('_/models/character', function() {
    it('sets the name if not empty string', function() {
        var emptyString = new Character();
        var notEmptyString = new Character();
        var notString = new Character();

        emptyString.setName('');
        notEmptyString.setName('name');
        notString.setName(1);

        expect(emptyString.get('name')).to.be(null);
        expect(notEmptyString.get('name')).to.be('name');
        expect(notString.get('name')).to.be(null);
    });

    it('sets the class if valid class name', function() {
        var valid = new Character();
        var notValid = new Character();

        valid.setClass('druid');
        notValid.setClass('monk');

        expect(valid.get('class')).to.be('druid');
        expect(notValid.get('class')).to.be(null);
    });

    it('sets the race if valid race name', function() {
        var valid = new Character();
        var notValid = new Character();

        valid.setRace('human');
        notValid.setRace('pandaren');

        expect(valid.get('race')).to.be('human');
        expect(notValid.get('race')).to.be(null);
    });

    it('sets the gender if valid gender', function() {
        var valid = new Character();
        var notValid = new Character();

        valid.setGender('male');
        notValid.setGender('unisex');

        expect(valid.get('gender')).to.be('male');
        expect(notValid.get('gender')).to.be(null);
    });

    it('sets the level if integer between 1 and 60', function() {
        var intBelow = new Character();
        var intOne = new Character();
        var intSixty = new Character();
        var intAbove = new Character();
        var notInt = new Character();

        intBelow.setLevel(0);
        intOne.setLevel(1);
        intSixty.setLevel(60);
        intAbove.setLevel(61);
        notInt.setLevel('level');

        expect(intBelow.get('level')).to.be(null);
        expect(intOne.get('level')).to.be(1);
        expect(intSixty.get('level')).to.be(60);
        expect(intAbove.get('level')).to.be(null);
        expect(notInt.get('level')).to.be(null);
    });

    it('sets the rank if interger above 0', function() {
        var intBelow = new Character();
        var intZero = new Character();
        var intAbove = new Character();
        var notInt = new Character();

        intBelow.setGuildRank(-1);
        intZero.setGuildRank(0);
        intAbove.setGuildRank(1);
        notInt.setGuildRank('guildRank');

        expect(intBelow.get('guildRank')).to.be(null);
        expect(intZero.get('guildRank')).to.be(0);
        expect(intAbove.get('guildRank')).to.be(1);
        expect(notInt.get('guildRank')).to.be(null);
    });

    it('returns true if no model value if null', function() {
        var hasNull = new Character();
        var notHasNull = new Character();

        notHasNull.setName('name');
        notHasNull.setClass('warrior');
        notHasNull.setRace('human');
        notHasNull.setGender('male');
        notHasNull.setLevel(60);
        notHasNull.setGuildRank(0);

        expect(hasNull.isValid()).to.be(false);
        expect(notHasNull.isValid()).to.be(true);
    });

    it('returns null if not valid character', function() {
        var valid = new Character();
        var notValid = new Character();

        valid.setName('name');
        valid.setClass('warrior');
        valid.setRace('human');
        valid.setGender('male');
        valid.setLevel(60);
        valid.setGuildRank(0);

        expect(valid.getData()).to.be.ok();
        expect(notValid.getData()).to.be(null);
    });

    it('returns all the model but excluding the name', function() {
        var character = new Character();

        character.setName('name');
        character.setClass('warrior');
        character.setRace('human');
        character.setGender('male');
        character.setLevel(60);
        character.setGuildRank(0);

        expect(character.getData().name).to.be(undefined);
    });
});

