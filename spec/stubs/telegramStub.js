'use strict'

var tg = {};

tg.sendTextMessage = function(message, chatId) {
    tg.message = message;
    tg.chatId = chatId;
};

module.exports = tg;
