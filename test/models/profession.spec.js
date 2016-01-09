var expect = require('expect.js');
var Profession = require('_/models/profession');

describe('_/models/profession', function() {
    it('sets the profession name if valid', function() {
        var valid = new Profession();
        var notValid = new Profession();

        valid.setName('mining');
        notValid.setName('jewelcrafting');

        expect(valid.get('name')).to.be('mining');
        expect(notValid.get('name')).to.be(null);
    });

    it('sets the character name if not empty string', function() {
        var emptyString = new Profession();
        var notEmptyString = new Profession();
        var notString = new Profession();

        emptyString.setCharacterName('');
        notEmptyString.setCharacterName('name');
        notString.setCharacterName(1);

        expect(emptyString.get('characterName')).to.be(null);
        expect(notEmptyString.get('characterName')).to.be('name');
        expect(notString.get('characterName')).to.be(null);
    });

    it('sets the level if integer between 1 and 300', function() {
        var intBelow = new Profession();
        var intOne = new Profession();
        var intThreeHundred = new Profession();
        var intAbove = new Profession();
        var notInt = new Profession();

        intBelow.setLevel(0);
        intOne.setLevel(1);
        intThreeHundred.setLevel(300);
        intAbove.setLevel(301);
        notInt.setLevel('level');

        expect(intBelow.get('level')).to.be(null);
        expect(intOne.get('level')).to.be(1);
        expect(intThreeHundred.get('level')).to.be(300);
        expect(intAbove.get('level')).to.be(null);
        expect(notInt.get('level')).to.be(null);
    });
});

