var Guild = require('./guild');

const URL = 'http://armory.twinstar.cz';

function guild(realm, guildName) {
    var guild = new Guild(URL, realm, guildName);
    return guild.getData();
}

module.exports = {
    Guild: guild
};

