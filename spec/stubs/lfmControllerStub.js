'use strict'

var lfm = {};

lfm.getArtistImage = function(artist, send) {
    lfm.called = true;
    send(artist);
};

lfm.getSimilarArtists = function (artist, send) {
    lfm.called = true;
    send(artist);
};

lfm.getTrackInfo = function (artist, track, send) {
    lfm.called = true;
    send(artist + track);
};

lfm.reset = function () {
    lfm.called = false;
}

module.exports = lfm;
