'use strict'

var lfmAPI = require('./lfmAPI');
var config = require('../config');
var youtube = require('./storage/youtube');
var lfmUtils = require('./lfmUtils');

var lfm = {};
lfm.totalTracks = {};

lfm.getArtistInfo = function(artist, send) {
    lfmAPI.artist.getInfo(artist, function(artist) {
        if (artist.error) {
            return send(artist.message)
        };
        artist = artist.artist;
        if (artist.image[4]['#text']){
            send(artist.image[4]['#text'], 0);
        };
        var artistInfo = 'Listeners: ' + artist.stats.listeners;
        artistInfo += '\nScrobbles: ' + artist.stats.playcount;
        if (artist.similar.artist.length > 0) {
            artistInfo += '\nSimilar artists: ';
            artist.similar.artist.forEach( function (artist) {
                artistInfo += lfmUtils.addHyperlinkTag(artist.url, artist.name);
                artistInfo += ' ';
            });
        };
        if (artist.tags.tag.length > 0) {
            artistInfo += '\nTags: ';
            artist.tags.tag.forEach( function (tag) {
                artistInfo += tag.name + ' ';
            });
        };
        if (artist.bio.summary) {
            artistInfo += '\nInfo: ' + artist.bio.summary;
        };
        send(artistInfo, 1);
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
            return send(tracks.message);
        };
        var htmlMarkupTracks;
        if (tracks.toptracks.track.length === 0) {
            htmlMarkupTracks = 'No tracks found. Try lower page number';
        } else {
            htmlMarkupTracks = tracks.toptracks.track.map(function (track) {
                return lfmUtils.addHyperlinkTag(track.url, track.name);
            }).join('\n');
        };
        var inlineKeyboard = lfmUtils.createTracksInlineKeyboard(tracks.toptracks.track, 'youtube');
        inlineKeyboard = lfmUtils.addNavKeyboard(artist, page, inlineKeyboard);

        send(htmlMarkupTracks, inlineKeyboard);
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

lfm.getTotalTracks = function (tag, callback, send) {
    if (lfm.totalTracks[tag]) {
        return callback(lfm.totalTracks[tag]);
    };
    lfmAPI.tag.getTopTracks(tag, 1, 1, function (tracks) {
        var totalTracks = tracks.tracks['@attr'].total;
        if (totalTracks === 0) {
            return send('No songs with this tag');
        };
        //Last.fm sends wrong total (wrong by a lot), so division by 3 should cut off all empty responses
        totalTracks /= 3;
        //If number of tracks still more than 10k - most likely there is an error
        if (totalTracks > 10000) {
            totalTracks = 10000;
        };
        lfm.totalTracks[tag] = totalTracks;
        callback(lfm.totalTracks[tag]);
    });
};

lfm.getRandomTrackNumber = function (tag, callback, send) {
    lfm.getTotalTracks(tag, function (totalTracks) {
        var trackNum = Math.ceil(Math.random() * totalTracks);
        callback(trackNum);
    }, send);
};

lfm.getRandomSong = function (tag, callback, send) {
    lfm.getRandomTrackNumber(tag, function (trackNum) {
        lfmAPI.tag.getTopTracks(tag, trackNum, 1, function (tracks) {
            if (tracks.tracks.track.length === 0) {
                //Empty response because of Last.fm bug
                //Try to get normal response
                return lfm.getRandomSong(tag, callback, send);
            };
            var track = {
                artist: tracks.tracks.track[0].artist.name,
                name: tracks.tracks.track[0].name
            };
            send(`Your song: ${track.artist} — ${track.name}`)
            callback(track);
        });
    });
};

module.exports = lfm;
