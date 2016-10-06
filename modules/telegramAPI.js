'use strict'

var config = require('../config');
var https = require('https');
var qs = require('querystring');

var tg = {};

tg.setupWebhook = function() {
    https.get(
        config.TELEGRAM_FULL_URL +
        '/setWebhook' +
        '?url=' +
        config.WEBHOOK_BASE_URL +
        config.BOT_WEBHOOK_PATH
    ).on('error', function(e) {
        console.log(`Problem with request: ${e.message}`);
    });
};

tg.sendTextMessage = function(message, chatId, parseMode, hidePreview, replyTo, replyMarkup) {

    var postData = JSON.stringify({
        text: message,
        chat_id : chatId,
        parse_mode: parseMode || '',
        disable_web_page_preview: hidePreview || 0,
        reply_to_message_id: replyTo || '',
        reply_markup: replyMarkup || ''
    });

    var options = {
        hostname: config.TELEGRAM_BASE_URL,
        port: 443,
        path: '/bot' + config.TOKEN + '/sendMessage',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = https.request(options);

    req.on('error', function(e) {
        console.log(`Problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
};

tg.selectiveForceReply = function (message, requestMessage, parseMode, hidePreview) {
    tg.sendTextMessage(
        message,
        requestMessage.chat.id,
        parseMode,
        hidePreview,
        message.from.id,
        {
            'force_reply': true,
            'selective': true
        }
    );
};

module.exports = tg;
