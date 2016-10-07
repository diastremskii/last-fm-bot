'use strict'

var config = require('../config');
var tg = require('./telegram/telegramAPI');
var botCommands = require('./botCommands')

var bot = {};

bot.verifyMessage = function(body) {
    var message = body.message;
    if (bot.containsCommand(message)) {
        botCommands.clearContext(message.from.id);
        message.text = bot.normalizeMessage(message.text);
        var parsed = bot.parseCommand(message.text);
        if (bot.commandExists(parsed.command, message.chat.id)) {
            botCommands[parsed.command](parsed.parameters, message);
        }
    } else {
        botCommands.notACommand(message);
    }
};

bot.normalizeMessage = function(text) {
  return text.replace('@' + config.BOT_NAME, '');
};

bot.commandExists = function(command, chatId) {
    if (!botCommands.hasOwnProperty(command)) {
        tg.sendTextMessage(`Command ${command} does not exist`, chatId);
    } else {
        return true;
    };
};

bot.parseCommand = function(text) {
    if (text.indexOf(' ') === -1) {
        return {
            command: text,
            parameters: undefined
        };
    } else {
        return {
            command: text.slice(0, text.indexOf(' ')),
            parameters: text.slice(text.indexOf(' ')+1)
        };
    }
};

bot.containsCommand = function(message) {
    if (!message.hasOwnProperty('text')) {
        return false;
    } else {
        return message.text.indexOf('/') === 0;
    };
};

module.exports = bot;
