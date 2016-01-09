var expect = require('expect.js');
var BaseModel = require('_/models/base-model');

describe('_/models/base-model', function() {
    it('returns true if no model value is null', function() {
        var hasNull = new BaseModel({ key: null });
        var notHasNull = new BaseModel({ key: 'value' });

        expect(hasNull.isValid()).to.be(false);
        expect(notHasNull.isValid()).to.be(true);
    });

    it('returns the key value if it exists', function() {
        var exist = new BaseModel({ key: 'value' });
        var notExist = new BaseModel({});

        expect(exist.get('key')).to.be('value');
        expect(notExist.get('key')).to.be(null);
    });
});

