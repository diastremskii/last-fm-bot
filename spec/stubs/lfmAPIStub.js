'use strict'

var lfmAPI = {};

lfmAPI.artist = {};
lfmAPI.track = {};

var lfmResponses = require('../data/lfmResponses');

lfmAPI.artist.getInfo = function(artist, callback) {
    switch (artist) {
        case 'Hypnogaja':
            callback(lfmResponses.artist.getInfoGood);
            break;
        case 'asddsa':
            callback(lfmResponses.artist.getInfoNoImage);
            break;
        default:
            callback(lfmResponses.artist.error);
    }
};

lfmAPI.artist.getSimilar = function (artist, callback) {
    switch (artist) {
        case 'Epica':
            callback(lfmResponses.artist.getSimilarGood);
            break;
        case 'asddsa':
            callback(lfmResponses.artist.getSimilarNoSimilar);
            break;
        default:
            callback(lfmResponses.artist.error);
    }
};

lfmAPI.track.getInfo = function (artist, track, callback) {
    switch (artist) {
        case 'Korn':
            callback(lfmResponses.track.getInfoGood);
            break;
        case 'Clawfinger':
            callback(lfmResponses.track.getInfoUrlOnly);
            break;
        default:
            callback(lfmResponses.track.error);
    }
};

lfmAPI.downloadFullPage = function (url, callback) {
    lfmAPI.downloadFullPage.called = true;
    if (/Clawfinger/.test(url)) {
        callback(lfmResponses.pageWithUrl);
    } else {
        callback(lfmResponses.pageWithoutUrl);
    };
};

lfmAPI.reset = function () {
    lfmAPI.downloadFullPage.called = false;
}

module.exports = lfmAPI;
