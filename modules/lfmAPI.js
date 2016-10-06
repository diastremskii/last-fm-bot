'use strict'

var config = require('../config');
var qs = require('querystring');
var http = require('http');

var lfmAPI = {};

lfmAPI.artist = {};
lfmAPI.track = {};

lfmAPI.executeMethod = function (method, options, callback) {
    http.get(config.LFM_API_URL + method + options + '&api_key=' + config.LFM_TOKEN
    + '&format=json', function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            try {
                var json = JSON.parse(body);
            } catch (e) {
                console.log(`Bad JSON: ${e.message}`);
                return;
            };
            callback(json);
        });
    }).on('error', function(e) {
        console.log(`Problem with request: ${e.message}`);
    });
}

lfmAPI.downloadFullPage = function (url, callback) {
    http.get(url, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            callback(body);
        });
    }).on('error', function(e) {
        console.log(`Problem with request: ${e.message}`);
    });
};

lfmAPI.artist.getInfo = function(artist, callback) {
    lfmAPI.executeMethod(
        'artist.getinfo',
        '&artist=' + qs.escape(artist) + '&autocorrect=' + config.LFM_AUTOCORRECT,
        callback
    );
};

lfmAPI.artist.getSimilar = function (artist, callback) {
    lfmAPI.executeMethod(
        'artist.getsimilar',
        '&artist=' + qs.escape(artist) + '&autocorrect=' + config.LFM_AUTOCORRECT + '&limit=10',
        callback
    );
};

lfmAPI.artist.getTopTracks = function (artist, page, callback) {
    lfmAPI.executeMethod(
        'artist.gettoptracks',
        '&artist=' + qs.escape(artist) + '&autocorrect=' + config.LFM_AUTOCORRECT + '&limit=10&page=' + page,
        callback
    );
};

lfmAPI.track.getInfo = function (artist, track, callback) {
    lfmAPI.executeMethod(
        'track.getinfo',
        '&artist=' + qs.escape(artist) + '&track=' + qs.escape(track) + '&autocorrect=' +  config.LFM_AUTOCORRECT,
        callback
    );
};

module.exports = lfmAPI;
