'use strict'

var botQueryHandler = require('./storage/replyQuery');
var tg = require('./telegram/telegramAPI');
var replyQuery = require('./storage/replyQuery');
var lfm = require('./lfmController')

botQueryHandler.answer = function (query, queryData) {
    botQueryHandler[queryData.method](query, queryData);
};

botQueryHandler.youtube = function (query, queryData) {
    var replyData  = replyQuery.get(queryData.artist, queryData.object, 'tracks');
    lfm.getYouTubeLink(replyData.artist, replyData.object, function (response) {
        tg.sendTextMessage(response, query.message.chat.id);
        tg.answerCallbackQuery(query.id);
    });
};

module.exports = botQueryHandler;
