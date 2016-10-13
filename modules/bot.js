'use strict'

var config = require('../config');
var tg = require('./telegram/telegramAPI');
var botCommands = require('./botCommands')
var botQueryHandler = require('./botQueryHandler')
var qs = require('querystring');

var bot = {};

bot.verifyRequest = function(body) {
    if (body.message) {
        bot.verifyMessage(body.message);
    } else if (body.callback_query) {
        bot.verifyCallbackQuery(body.callback_query);
    };
};

bot.verifyMessage = function (message) {
    if (bot.containsCommand(message)) {
        message.text = bot.normalizeMessage(message.text);
        var parsed = bot.parseCommand(message.text);
        if (bot.commandExists(parsed.command, message.chat.id)) {
            botCommands.execute(parsed.command, parsed.parameters, message);
        }
    } else {
        botCommands.notACommand(message);
    };
};

bot.verifyCallbackQuery = function (query) {
    if (query.data) {
        botQueryHandler.answer(query, qs.parse(query.data));
    };
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
