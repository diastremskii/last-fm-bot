'use strict'

var lfmAPI = require('./lfmAPI');
var config = require('../config');

var lfm = {};

lfm.getArtistImage = function(artist, send) {
    lfmAPI.artist.getInfo(artist, function(artistInfo) {
        if (artistInfo.error) {
            send(artistInfo.message)
        } else if (artistInfo.artist.image[4]['#text'] === ''){
            send('This artist does not have an image');
        } else {
            send(artistInfo.artist.image[4]['#text']);
        };
    });
};

lfm.getSimilarArtists = function (artist, send) {
    lfmAPI.artist.getSimilar(artist, function(artists) {
        if (artists.error) {
            send(artists.message);
        } else if (artists.similarartists.artist.length === 0) {
            send('No similar artists');
        } else {
            var htmlMarkdownArtists = artists.similarartists.artist.map( function(artist) {
                return lfm._HTMLUrlTag(artist.url, artist.name);
            }).concat(lfm._getMoreSimilarURL(artist)).join('\n');;
            send(htmlMarkdownArtists);
        }
    });
};

lfm.getTrackInfo = function (artist, track, send) {
    lfmAPI.track.getInfo(artist, track, function (track) {
        if (track.error) {
            send(track.message);
        } else {
            track = track.track;
            var trackInfo = '\nListeners: ' + track.listeners;
            trackInfo += '\nScrobbles: ' + track.playcount;
            if (track.album) {
                trackInfo += '\n' + lfm._HTMLUrlTag(track.album.url, 'Album: ' + track.album.title);
            };
            if (track.toptags.tag.length>0) {
                trackInfo += '\nTags: ';
                track.toptags.tag.forEach( function (tag) {
                    trackInfo += tag.name + ' ';
                });
            };
            if (track.wiki) {
                trackInfo += '\nInfo: ' + track.wiki.summary;
            };
            send(trackInfo);
        };
    });
};

lfm._HTMLUrlTag = function (url, description) {
    return '<a href="' + lfm._dotsEncode(url) + '">' + lfm._HTMLEscape(description) + '</a>';
};

lfm._HTMLEscape = function (string) {
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

lfm._dotsEncode = function (string) {
    //String returned by Lfm already escaped, but we need to
    //replace dots after domain for Telegram to correctly parse it
    return config.LFM_URL + '/music/' + string.split('/').pop().replace(/\./g, '%2E');
};

lfm._getMoreSimilarURL = function (artist) {
    return '\n<a href="' + lfm._dotsEncode(artist) + '/+similar">Find more similar artists</a>';
};

module.exports = lfm;
