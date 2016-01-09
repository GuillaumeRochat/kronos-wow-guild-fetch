var expect = require('expect.js');
var Activity = require('_/models/activity');

describe('_/models/activity', function() {
    it('sets the type if valid', function() {
        var valid = new Activity();
        var notValid = new Activity();

        valid.setType('loot');
        notValid.setType('death');

        expect(valid.get('type')).to.be('loot');
        expect(notValid.get('type')).to.be(null);
    });

    it('sets the id if the activity above 0', function() {
        var intBelow = new Activity();
        var intAbove = new Activity();
        var notInt = new Activity();

        intBelow.setId(0);
        intAbove.setId(1);
        notInt.setId('id');

        expect(intBelow.get('id')).to.be(null);
        expect(intAbove.get('id')).to.be(1);
        expect(notInt.get('id')).to.be(null);
    });

    it('sets the character name if not empty string', function() {
        var emptyString = new Activity();
        var notEmptyString = new Activity();
        var notString = new Activity();

        emptyString.setCharacterName('');
        notEmptyString.setCharacterName('characterName');
        notString.setCharacterName(1);

        expect(emptyString.get('characterName')).to.be(null);
        expect(notEmptyString.get('characterName')).to.be('characterName');
        expect(notString.get('characterName')).to.be(null);
    });

    it('sets the datime if valid ISO-8601 at UTC time', function() {
        var iso = new Activity();
        var notIso = new Activity();

        iso.setDatetime('1970-01-01T12:12:12Z');
        notIso.setDatetime('70-01-01 12:12:12');

        expect(iso.get('datetime')).to.be('1970-01-01T12:12:12Z');
        expect(notIso.get('datetime')).to.be(null);
    });
});

