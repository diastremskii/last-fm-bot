'use strict'

var config = require('../../config');
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

tg.sendPostRequest =function (postData, method) {
    var options = {
        hostname: config.TELEGRAM_BASE_URL,
        port: 443,
        path: '/bot' + config.TOKEN + method,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    if (process.env.DEBUG === '1') {
        var req = https.request(options, function (res) {
            var data = '';

            res.on('data', function (chunk) {
                data+=chunk;
            });
            res.on('end', function () {
                console.log(postData);
                console.log(data);
            });
        });
    } else {
        var req = https.request(options);
    };

    req.on('error', function(e) {
        console.log(`Problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
};

tg.sendTextMessage = function(text, chatId, parseMode, hidePreview, replyTo, replyMarkup) {

    var postData = JSON.stringify({
        text: text,
        chat_id : chatId,
        parse_mode: parseMode || '',
        disable_web_page_preview: hidePreview || 0,
        reply_to_message_id: replyTo || '',
        reply_markup: replyMarkup || ''
    });

    tg.sendPostRequest(postData, '/sendMessage');
};

tg.selectiveForceReply = function (text, message, parseMode, hidePreview) {
    tg.sendTextMessage(
        text,
        message.chat.id,
        parseMode,
        hidePreview,
        message.message_id,
        {
            'force_reply': true,
            'selective': true
        }
    );
};

tg.answerCallbackQuery = function (queryId, text, showAlert, url) {
    var postData = JSON.stringify({
        callback_query_id: queryId,
        text : text || '',
        show_alert: showAlert || 0,
        url: url || ''
    });

    tg.sendPostRequest(postData, '/answerCallbackQuery');
};

tg.editMessageText =function (chatId, messageId, inlineMessageId, text, parseMode, hidePreview, replyMarkup) {
    var postData = JSON.stringify({
        chat_id: chatId || '',
        message_id: messageId || '',
        inline_message_id: inlineMessageId || '',
        text: text,
        parse_mode: parseMode || '',
        disable_web_page_preview: hidePreview || 0,
        reply_markup: replyMarkup || ''
    });

    tg.sendPostRequest(postData, '/editMessageText');
}

module.exports = tg;
