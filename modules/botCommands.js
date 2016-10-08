'use strict'

var tg = require('./telegram/telegramAPI');
var lfm = require('./lfmController');
var context = require('./storage/context');

var botCommands = {};

botCommands.notACommand = function (message) {
    if (context.hasOwnProperty(message.from.id)) {
        var command =  context[message.from.id].command;
        var stage = context[message.from.id].stage;
        var parameters = context[message.from.id].parameters;
        if (!parameters) {
            parameters = message.text;
        } else {
            parameters.push(message.text);
        };
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
        tg.selectiveForceReply('Send me the artist name please', message);
        context.save(message.from.id, '/track', 'waitForArtist');
    } else {
        if (stage === 'waitForArtist' || !stage) {
            tg.selectiveForceReply('Now send a name of the track please', message);
            context.save(message.from.id, '/track', 'waitForTrack', parameters);
        } else {
            lfm.getTrackInfo(parameters[0], parameters[1], function (response) {
                tg.sendTextMessage(response, message.chat.id, 'HTML', 1);
            });
        };
    };
};

botCommands['/atracks'] = function (parameters, message, stage) {
    if (!parameters) {
        tg.selectiveForceReply('Send me the artist name please', message);
        context.save(message.from.id, '/atracks', 'waitForArtist');
    } else {
        if (stage === 'waitForArtist' || !stage) {
            tg.selectiveForceReply('Great! Now select a page number', message);
            context.save(message.from.id, '/atracks', 'waitForPage', parameters);
        } else {
            if (isNaN(parseInt(parameters[1]))) {
                tg.selectiveForceReply('Page should be a number', message);
                context.pop(message.from.id);
            } else {
                lfm.getTopTracks(parameters[0], parameters[1], function (response) {
                    tg.sendTextMessage(response, message.chat.id, 'HTML', 1);
                });
            };
        };
    };
};

botCommands['/yb'] = function (parameters, message, stage) {
    if (!parameters) {
        tg.selectiveForceReply('Send me the artist name please', message);
        context.save(message.from.id, '/yb', 'waitForArtist');
    } else {
        if (stage === 'waitForArtist' || !stage) {
            tg.selectiveForceReply('Now send a name of the track please', message);
            context.save(message.from.id, '/yb', 'waitForTrack', parameters);
        } else {
            lfm.getYouTubeLink(parameters[0], parameters[1], function (response) {
                tg.sendTextMessage(response, message.chat.id);
            });
        };
    };
};

botCommands['/start'] = function (parameters, message) {
    tg.sendTextMessage('Howdy! This bot can provide you interaction with Last.fm via Telegram. Try /help to learn how to use the bot', message.chat.id);
};

botCommands['/help'] = function (parameters, message) {
    tg.sendTextMessage(
        '[] - means what this argument is optional\n \
/artpic _artist_ - get a picture of an artist\n \
Try: /artpic Bat For Lashes\n \
/sa <i>artist</i> - get similar artists\n \
Try: /sa ムック\n \
/track <i>artist</i> - get info about a track for given artist\n \
/yb [artist] - get YouTube link for track\n \
/atracks [artist] - get top tracks for given artist]',
        message.chat.id,
        'HTML')
};

botCommands.clearContext = function (fromId) {
    delete context[fromId];
};

module.exports = botCommands;
