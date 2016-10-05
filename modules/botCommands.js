'use strict'

var tg = require('./telegramAPI');
var lfm = require('./lfmController');

var botCommands = {};

botCommands['/artpic'] = function(parameters, message) {
    if (!parameters) {
        tg.sendTextMessage('Please specify an artist', message.chat.id);
    } else {
        lfm.getArtistImage(parameters, function(response) {
            tg.sendTextMessage(response, message.chat.id);
        });
    };
};

botCommands['/sa'] = function (parameters, message) {
    if (!parameters) {
        tg.sendTextMessage('Please specify an artist', message.chat.id);
    } else {
        lfm.getSimilarArtists(parameters, function(response) {
            tg.sendTextMessage(response, message.chat.id, 'HTML', 1);
        });
    };
};

botCommands['/start'] = function (parameters, message) {
    tg.sendTextMessage('Howdy! This bot can provide you interaction with Last.fm via Telegram. Try /help to learn how to use the bot', message.chat.id);
};

botCommands['/help'] = function (parameters, message) {
    tg.sendTextMessage('/artpic *artist* - get a picture of an artist \n Try: /artpic Bat For Lashes \n /sa *artist* - get similar artists \n Try: /sa ムック', message.chat.id, 'Markdown')
};

module.exports = botCommands;
