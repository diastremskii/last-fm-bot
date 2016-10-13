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

botQueryHandler.execute = function (query, queryData) {
    botQueryHandler[queryData.m](query, queryData, botQueryHandler._answer);
};

botQueryHandler.youtube = function (query, queryData, answer) {
    var replyData  = replyQuery.get(queryData.a, queryData.o, 'tracks');
    if (!replyData) {
        botQueryHandler._outdatedButton(query);
        return answer(query);
    };
    lfm.getYouTubeLink(replyData.artist, replyData.object, function (response) {
        tg.sendTextMessage(response, query.message.chat.id);
        return answer(query);
    });
};

botQueryHandler.prevPage = function (query, queryData) {
    var artist = replyQuery.getArtist(queryData.a);
    if (!artist) {
        botQueryHandler._outdatedButton(query);
        return answer(query);
    };
    if (queryData.page == '1') {
        tg.sendTextMessage('You are on page 1', query.message.chat.id);
        return answer(query);
    };
    lfm.getTopTracks(artist, +queryData.page - 1, function (response, replyMarkup) {
        botQueryHandler._editMessage(query, response, replyMarkup);
        answer(query);
    });
};

botQueryHandler.nextPage = function (query, queryData) {
    var artist = replyQuery.getArtist(queryData.a);
    if (!artist) {
        botQueryHandler._outdatedButton(query);
        return answer(query);
    };
    lfm.getTopTracks(artist, +queryData.page + 1, function (response, replyMarkup) {
        botQueryHandler._editMessage(query, response, replyMarkup);
        answer(query);
    });
};

botQueryHandler._outdatedButton = function (query) {

    tg.sendTextMessage('Sorry, this button is outdated', query.message.chat.id);
};

botQueryHandler._editMessage = function (query, response, replyMarkup) {
    tg.editMessageText(
        query.message.chat.id,
        query.message.message_id,
        null,
        response,
        'HTML',
        1,
        replyMarkup
    );
};

botQueryHandler._answer = function (query) {
     tg.answerCallbackQuery(query.id);
};

module.exports = botQueryHandler;
