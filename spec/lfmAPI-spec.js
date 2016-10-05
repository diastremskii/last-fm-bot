'use strict'

var lfmAPI = require('../modules/lfmAPI.js')

describe('Module for making requests to Last.fm API', function () {
    describe('artist.getInfo', function () {
        it('gets info about given artist', function (done) {
            lfmAPI.artist.getInfo('Train', function (artistInfo) {
                expect(artistInfo.artist.name).toEqual('Train');
                done();
            });
        });
    });
    describe('artist.getSimilar', function () {
        it('gets similar artists', function (done) {
            lfmAPI.artist.getSimilar('Train', function (artists) {
                expect(artists.similarartists.artist.length).toBeGreaterThan(0);
                done();
            });
        });
    });
});
