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
    describe('track.getInfo', function () {
        it('gets info about track', function (done) {
            lfmAPI.track.getInfo('Band of Sculls', "You're Not Pretty But You Got It Goin' On", function (trackInfo) {
                expect(trackInfo.track.name).toEqual("You're Not Pretty But You Got It Goin' On");
                done();
            });
        });
    });
    describe('downloadFullPage', function () {
        it('downloads full Last.fm page', function (done) {
            lfmAPI.downloadFullPage('https://www.last.fm/music/Natalie+Imbruglia/_/Torn', function (body) {
                expect(body.length).toBeGreaterThan(0);
                done();
            });
        });
    });
    describe('artist.getTopTracks', function () {
        it('gets top tracks for given artist', function (done) {
            lfmAPI.artist.getTopTracks('R.E.M.', '1', function (tracks) {
                expect(tracks.toptracks.track[0].name).toEqual('Losing My Religion');
                done();
            });
        });
    });
});
