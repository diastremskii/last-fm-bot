'use strict'

var lfm = {};

lfm.getArtistImage = function(artist, send) {
    lfm.called = true;
    send(artist);
};

lfm.getSimilarArtists = function (artist, send, limit) {
    lfm.called = true;
    send(artist);
};

lfm.reset = function () {
    lfm.called = false;
}

module.exports = lfm;
