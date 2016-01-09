var expect = require('expect.js');
var Item = require('_/models/item');

describe('_/models/item', function() {
    it('sets the id if it above 0', function() {
        var intBelow = new Item();
        var intAbove = new Item();
        var notInt = new Item();

        intBelow.setId(0);
        intAbove.setId(1);
        notInt.setId('id');

        expect(intBelow.get('id')).to.be(null);
        expect(intAbove.get('id')).to.be(1);
        expect(notInt.get('id')).to.be(null);
    });

    it('sets the character name if not empty string', function() {
        var emptyString = new Item();
        var notEmptyString = new Item();
        var notString = new Item();

        emptyString.setCharacterName('');
        notEmptyString.setCharacterName('characterName');
        notString.setCharacterName(1);

        expect(emptyString.get('characterName')).to.be(null);
        expect(notEmptyString.get('characterName')).to.be('characterName');
        expect(notString.get('characterName')).to.be(null);
    });

    it('sets the datime if valid ISO-8601 at UTC time', function() {
        var iso = new Item();
        var notIso = new Item();

        iso.setDatetime('1970-01-01T12:12:12Z');
        notIso.setDatetime('70-01-01 12:12:12');

        expect(iso.get('datetime')).to.be('1970-01-01T12:12:12Z');
        expect(notIso.get('datetime')).to.be(null);
    });

    it('returns true if no model value is null', function() {
        var hasNull = new Item();
        var notHasNull = new Item();

        notHasNull.setId(1);
        notHasNull.setCharacterName('characterName');
        notHasNull.setDatetime('1970-01-01T00:00:00Z');

        expect(hasNull.isValid()).to.be(false);
        expect(notHasNull.isValid()).to.be(true);
    });
});

