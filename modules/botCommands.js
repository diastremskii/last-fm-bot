'use strict'

var tg = require('./telegram/telegramAPI');
var lfm = require('./lfmController');
var context = require('./storage/context');

var botCommands = {};

botCommands.GENERIC_COMMANDS = ['/help', '/start'];

botCommands.notACommand = function (message) {
    if (context.hasOwnProperty(message.from.id)) {
        var command =    context[message.from.id].command;
        var stage = ++context[message.from.id].stage;
        var parameters = context[message.from.id].parameters;
        context.pushParameters(message.from.id, message.text);
        botCommands[command](parameters, message, stage);
    };
};

botCommands.execute = function (command, parameters, message) {
    if (botCommands.GENERIC_COMMANDS.indexOf(command) > -1) {
        return botCommands[command](parameters, message, stage);
    };
    var stage;
    if (parameters) {
        stage = 1;
    } else {
        stage = 0;
    };
    context.save(message.from.id, command, stage);
    context.pushParameters(message.from.id, parameters);
    botCommands[command](parameters, message, stage);
};

botCommands['/artpic'] = function(parameters, message, stage) {
    switch (stage) {
        case 0:
            tg.selectiveForceReply('Send me the artist name please', message);
            break;
        case 1:
            lfm.getArtistImage(parameters, function (response) {
                tg.sendTextMessage(response, message.chat.id);
            });
            botCommands.clearContext(message.from.id);
            break;
    };
};

botCommands['/sa'] = function (parameters, message, stage) {
    switch (stage) {
        case 0:
            tg.selectiveForceReply('Send me the artist name please', message);
            break;
        case 1:
            lfm.getSimilarArtists(parameters, function(response) {
                tg.sendTextMessage(response, message.chat.id, 'HTML', 1);
            });
            botCommands.clearContext(message.from.id);
            break;
    };
};

botCommands['/track'] = function (parameters, message, stage) {
    switch (stage) {
        case 0:
            tg.selectiveForceReply('Send me the artist name please', message);
            break;
        case 1:
            tg.selectiveForceReply('Now send a name of the track please', message);
            break;
        case 2:
            lfm.getTrackInfo(parameters[0], parameters[1], function (response) {
                tg.sendTextMessage(response, message.chat.id, 'HTML', 1);
            });
            botCommands.clearContext(message.from.id);
            break;
    };
};

botCommands['/atracks'] = function (parameters, message, stage) {
    switch (stage) {
        case 0:
            tg.selectiveForceReply('Send me the artist name please', message);
            break;
        case 1:
            tg.selectiveForceReply('Great! Now select a page number', message);
            break;
        case 2:
            if (isNaN(parseInt(parameters[1]))) {
                tg.selectiveForceReply('Page should be a number', message);
                context.pop(message.from.id);
                return;
            };
            lfm.getTopTracks(parameters[0], parameters[1], function (response, replyMarkup) {
                tg.sendTextMessage(response, message.chat.id, 'HTML', 1, null, replyMarkup);
            });
            botCommands.clearContext(message.from.id);
            break;
    };
};

botCommands['/yb'] = function (parameters, message, stage) {
    switch (stage) {
        case 0:
            tg.selectiveForceReply('Send me the artist name please', message);
            break;
        case 1:
            tg.selectiveForceReply('Now send a name of the track please', message);
            break;
        case 2:
            lfm.getYouTubeLink(parameters[0], parameters[1], function (response) {
                tg.sendTextMessage(response, message.chat.id);
            });
            botCommands.clearContext(message.from.id);
            break;

    };
};

botCommands['/start'] = function (parameters, message) {
    tg.sendTextMessage('Howdy! This bot can provide you interaction with Last.fm via Telegram. Try /help to learn how to use the bot', message.chat.id);
};

botCommands['/help'] = function (parameters, message) {
    tg.sendTextMessage(
        '[] - means what this argument is optional\n \
/artpic [artist] - get a picture of an artist\n \
Try: /artpic Bat For Lashes\n \
/sa [artist] - get similar artists\n \
Try: /sa ムック\n \
/track [artist] - get info about a track for given artist\n \
/yb [artist] - get YouTube link for track\n \
/atracks [artist] - get top tracks for given artist]',
        message.chat.id,
        'HTML')
};

botCommands.clearContext = function (fromId) {
    delete context[fromId];
};

module.exports = botCommands;
