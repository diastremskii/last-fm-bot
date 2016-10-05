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

lfmAPI.artist.getSimilar = function (artist, limit, callback) {
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

module.exports = lfmAPI;
