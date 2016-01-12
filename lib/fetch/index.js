var Guild = require('./guild');

const URL = 'http://armory.twinstar.cz';

function guild(guildName) {
    var guild = new Guild(URL, guildName);
    return guild.getData();
}

module.exports = {
    Guild: guild
};

