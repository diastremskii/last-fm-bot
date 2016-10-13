'use strict'

var lfmAPI = require('./lfmAPI');
var config = require('../config');
var youtube = require('./storage/youtube');
var lfmUtils = require('./lfmUtils');

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
                return lfmUtils.addHyperlinkTag(artist.url, artist.name);
            }).concat(lfmUtils.getLinkToSimilar(artist)).join('\n');
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
                trackInfo += '\n' + lfmUtils.addHyperlinkTag(track.album.url, 'Album: ' + track.album.title);
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
                return lfmUtils.addHyperlinkTag(track.url, track.name);
            }).join('\n');
            var inlineKeyboard = lfmUtils.createTracksInlineKeyboard(tracks.toptracks.track, 'youtube');
            inlineKeyboard = lfmUtils.addNavKeyboard(artist, 1, inlineKeyboard);

            send(htmlMarkupTracks, inlineKeyboard);
        };
    });
};

//Not in official API. Dirty.
// TODO: Change to get youtube link with one request
lfm.getYouTubeLink = function (artist, track, send) {
    var youtubeLink = youtube.get(artist, track);
    if (youtubeLink) {
        send(youtubeLink);
    } else {
        lfmAPI.track.getInfo(artist, track, function (trackInfo) {
            if (trackInfo.error) {
                send(trackInfo.message);
            } else {
                var lfmLink=trackInfo.track.url.replace(/https:/, 'http:');
                lfmAPI.downloadFullPage(lfmLink, function (body) {
                    youtubeLink = body.match(/data-youtube-url="(.*?)"/);
                    if (youtubeLink) {
                        youtube.put(artist, track, youtubeLink[1]);
                        send(youtubeLink[1]);
                    } else {
                        youtube.put(artist, track, null);
                        send('No YouTube link found');
                    };
                });
            };
        });
    }
};

module.exports = lfm;
