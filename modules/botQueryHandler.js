'use strict'

var botQueryHandler = require('./storage/replyQuery');
var tg = require('./telegram/telegramAPI');
var replyQuery = require('./storage/replyQuery');
var lfm = require('./lfmController')

/*
  queryData.a - artist
  queryData.o - object (track/album)
  queryData.m - method
  short because of Telegram 64 bytes limit
*/

botQueryHandler.answer = function (query, queryData) {
    botQueryHandler[queryData.m](query, queryData);
};

botQueryHandler.youtube = function (query, queryData) {
    var replyData  = replyQuery.get(queryData.a, queryData.o, 'tracks');
    if (!replyData) {
        tg.answerCallbackQuery(query.id);
        return tg.sendTextMessage('Sorry, this button is outdated', query.message.chat.id);
    };
    lfm.getYouTubeLink(replyData.artist, replyData.object, function (response) {
        tg.sendTextMessage(response, query.message.chat.id);
        tg.answerCallbackQuery(query.id);
    });
};

botQueryHandler.prevPage = function () {

};

botQueryHandler.nextPage = function () {

};

botQueryHandler.goToPage = function () {

};

module.exports = botQueryHandler;
