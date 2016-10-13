'use strict'

var config = require('../config');
var tgTypes = require('./telegram/telegramTypes');
var qs = require('querystring');
var replyQuery = require('./storage/replyQuery');

var lfmUtils = {};

lfmUtils.addHyperlinkTag = function (url, description) {
    return '<a href="' + lfmUtils.encodeDots(url) + '">' + lfmUtils.escapeHTML(description) + '</a>';
};

lfmUtils.escapeHTML = function (string) {
    var replacements = [
        [ /\&/g, '&amp;'],
        [ /\</g, '&lt;' ],
        [ /\>/g, '&gt;' ]
    ];
    return replacements.reduce(
        function(string, replacement) {
            return string.replace(replacement[0], replacement[1])
        },
        string);
};

lfmUtils.encodeDots = function (string) {
    //String returned by Lfm already escaped, but we need to
    //replace dots after domain for Telegram to correctly parse it
    return config.LFM_URL + string.replace(config.LFM_URL, '').replace(/\./g, '%2E');
};

lfmUtils.getLinkToSimilar = function (artist) {
    return '\n<a href="' + config.LFM_URL + '/music/' + qs.escape(artist) + '/+similar">Find more similar artists</a>';
};

lfmUtils.createTracksInlineKeyboard = function (tracks, callbackMethod) {
    var inlineKeyboard = new tgTypes.InlineKeyboardMarkup(2);

    tracks.forEach(function (track) {
        var callbackData = replyQuery.add(track.artist.name, track.name, 'tracks');
        callbackData.m = callbackMethod;
        inlineKeyboard.add(track.name, 'callback_data', qs.stringify(callbackData));
    });
    return inlineKeyboard;
};

lfmUtils.addNavKeyboard = function (artist, currentPage, inlineKeyboard) {
    if (!inlineKeyboard) {
        var inlineKeyboard = new tgTypes.InlineKeyboardMarkup(2);
    };
    var callbackData = {
        a: replyQuery.getArtist(artist),
        page: currentPage
    };
    callbackData.m = 'prevPage';
    inlineKeyboard.add('⬅️', 'callback_data', qs.stringify(callbackData));

    callbackData.m = 'nextPage';
    inlineKeyboard.add('➡️', 'callback_data', qs.stringify(callbackData));

    return inlineKeyboard;
};

module.exports = lfmUtils;
