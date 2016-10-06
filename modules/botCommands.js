'use strict'

var tg = require('./telegramAPI');
var lfm = require('./lfmController');
var context = require('./contextStorage');

var botCommands = {};

botCommands.notACommand = function (message) {
    if (context.hasOwnProperty(message.from.id)) {
        var command =  context[message.from.id].command;
        var stage = context[message.from.id].stage;
        var parameters = context[message.from.id].parameters;
        parameters.push(message.text);
        botCommands[command](parameters, message, stage);
    };
};

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

botCommands['/track'] = function (parameters, message, stage) {
    if (!parameters) {
        tg.sendTextMessage('Please specify an artist', message.chat.id);
    } else {
        if (!stage) {
            tg.sendTextMessage(
                'Now send a name of the track please',
                message.chat.id,
                null,
                null,
                message.message_id,
                tg.selectiveForceReply);
            context.save(message.from.id, '/track', 'askForTrack', parameters);
        } else {
            context.delete(message.from.id);
            lfm.getTrackInfo(parameters[0], parameters[1], function (response) {
                tg.sendTextMessage(response, message.chat.id, 'HTML', 1);
            });
        };
    };
};

botCommands['/start'] = function (parameters, message) {
    tg.sendTextMessage('Howdy! This bot can provide you interaction with Last.fm via Telegram. Try /help to learn how to use the bot', message.chat.id);
};

botCommands['/help'] = function (parameters, message) {
    tg.sendTextMessage(
        '/artpic *artist* - get a picture of an artist \n' +
        'Try: /artpic Bat For Lashes \n' +
        '/sa *artist* - get similar artists \n' +
        'Try: /sa ムック\n' +
        '/track *artist* - get info about a track for given artist\n',
        message.chat.id,
        'Markdown')
};


module.exports = botCommands;
