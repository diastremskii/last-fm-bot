'use strict'

var tg = {};

tg.sendTextMessage = function(message, chatId) {
    tg.called = true;
    tg.message = message;
    tg.chatId = chatId;
};

tg.reset = function(message, chatId) {
    tg.called = false;
    tg.message = undefined;
    tg.chatId = undefined;
};

tg.mockSend = function (message) {
    tg.message = message;
}


module.exports = tg;
