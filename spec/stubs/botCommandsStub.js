'use strict'

var botCommands = {};

botCommands['/artpic'] = function(parameters, message) {
    botCommands.called = true;
    botCommands.artist = parameters;
    botCommands.username = message.from.username;
};

botCommands.execute = function(command, parameters, message) {
    botCommands.called = true;
    botCommands.artist = parameters;
    botCommands.username = message.from.username;
};

botCommands.reset = function () {
    botCommands.called = false;
    botCommands.artist = undefined;
    botCommands.username = undefined;
}

module.exports = botCommands;
