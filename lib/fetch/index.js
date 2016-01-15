var Characters = require('./characters');

const URL = 'http://armory.twinstar.cz';

function getCharacters(realm, guildName) {
    var characters = new Characters(URL, realm, guildName);
    return characters.getData();
}

module.exports = {
    GetCharacters: getCharacters
};

