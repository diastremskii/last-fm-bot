'use strict'

var lfmAPI = require('./lfmAPI');
var config = require('../config');
var qs = require('querystring');
var youtube = require('./storage/youtube');

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
            var htmlMarkupArtists = artists.similarartists.artist.map( function(artist) {
                return lfm._addHyperlinkTag(artist.url, artist.name);
            }).concat(lfm._getLinkToSimilar(artist)).join('\n');
            send(htmlMarkupArtists);
        }
    });
};

lfm.getTrackInfo = function (artist, track, send) {
    lfmAPI.track.getInfo(artist, track, function (track) {
        if (track.error) {
            send(track.message);
        } else {
            track = track.track;
            var trackInfo = 'Listeners: ' + track.listeners;
            trackInfo += '\nScrobbles: ' + track.playcount;
            if (track.album) {
                trackInfo += '\n' + lfm._addHyperlinkTag(track.album.url, 'Album: ' + track.album.title);
            };
            if (track.toptags.tag.length > 0) {
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

lfm.getTopTracks = function (artist, page, send) {
    lfmAPI.artist.getTopTracks(artist, page, function (tracks) {
        if (tracks.error) {
            send(tracks.message);
        } else if (tracks.toptracks.track.length === 0) {
            send('No tracks found. Try lower page number');
        } else {
            var htmlMarkupTracks = tracks.toptracks.track.map(function (track) {
                return lfm._addHyperlinkTag(track.url, track.name);
            }).join('\n');
            send(htmlMarkupTracks);
        };
    });
};

//Not in official API. Dirty.
lfm.getYouTubeLink = function (artist, track, send) {
    var songURL = youtube.get(artist, track);
    if (songURL) {
        send(songURL);
    } else {
        lfmAPI.track.getInfo(artist, track, function (track) {
            if (track.error) {
                send(track.message);
            } else {
                songURL=track.track.url.replace(/https:/, 'http:');
                lfmAPI.downloadFullPage(songURL, function (body) {
                    var url = body.match(/data-youtube-url="(.*?)"/);
                    if (url) {
                        youtube.put(artist, track, url);
                        send(url[1]);
                    } else {
                        youtube.put(artist, track, null);
                        send('No YouTube link found')
                    };
                });
            };
        });
    }
};

lfm._addHyperlinkTag = function (url, description) {
    return '<a href="' + lfm._encodeDots(url) + '">' + lfm._escapeHTML(description) + '</a>';
};

lfm._escapeHTML = function (string) {
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

lfm._encodeDots = function (string) {
    //String returned by Lfm already escaped, but we need to
    //replace dots after domain for Telegram to correctly parse it
    return config.LFM_URL + string.replace(config.LFM_URL, '').replace(/\./g, '%2E');
};

lfm._getLinkToSimilar = function (artist) {
    return '\n<a href="' + config.LFM_URL + '/music/' + qs.escape(artist) + '/+similar">Find more similar artists</a>';
};

module.exports = lfm;
