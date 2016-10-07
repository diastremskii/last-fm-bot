'use strict'

var proxyquire = require('proxyquire');
var lfmAPIStub = require('./stubs/lfmAPIStub');
var tgStub = require('./stubs/telegramAPIStub');
var youtube = require('../modules/storage/youtube');

var lfm = proxyquire('../modules/lfmController', {
    './lfmAPI': lfmAPIStub
});



describe('Controller for responses from Last.fm API:', function () {
    beforeEach(function() {
      lfmAPIStub.reset();
      tgStub.reset();
    });
    describe('getArtistImage', function () {
        it('gets a valid response', function () {
            lfm.getArtistImage('Hypnogaja', tgStub.mockSend);

            expect(tgStub.message).toEqual('https://lastfm-img2.akamaized.net/i/u/ee0cdc856bed4e7ba88bc8e14dc04296.png');
        });
        it('gets a response without image URL', function () {
            lfm.getArtistImage('asddsa', tgStub.mockSend);

            expect(tgStub.message).toEqual('This artist does not have an image');
        });
        it('gets a response with error', function () {
            lfm.getArtistImage('asddsaasd', tgStub.mockSend);

            expect(tgStub.message).toEqual('The artist you supplied could not be found');
        });
    });
    describe('getSimilarArtists', function () {
        it('gets a valid response', function () {
            lfm.getSimilarArtists('Epica', tgStub.mockSend);

            expect(tgStub.message).toEqual('<a href="https://www.last.fm/music/After+Forever">After Forever&lt;&gt;&amp;</a>' +
                '\n<a href="https://www.last.fm/music/Xa%2En%2Edria">Xandria</a>' +
                '\n\n<a href="https://www.last.fm/music/Epica/+similar">Find more similar artists</a>');
        });
        it('gets a response without image URL', function () {
            lfm.getSimilarArtists('asddsa', tgStub.mockSend);

            expect(tgStub.message).toEqual('No similar artists');
        });
        it('gets a response with error', function () {
            lfm.getSimilarArtists('asddsaasd', tgStub.mockSend);

            expect(tgStub.message).toEqual('The artist you supplied could not be found');
        });
    });
    describe('getTrackInfo', function () {
        it('gets a valid response', function () {
            lfm.getTrackInfo('Korn', 'Trash', tgStub.mockSend);

            expect(tgStub.message).toEqual('Listeners: 274145\nScrobbles: 1456439\n<a href="https://www.last.fm/music/Korn/Issues">Album: Issues</a>\nTags: Nu Metal alternative metal metal Korn rock ');
        });
        it('gets a response with error', function () {
            lfm.getTrackInfo('asddsaasd', 'ads', tgStub.mockSend);

            expect(tgStub.message).toEqual('Track not found');
        });
    });
    describe('getYouTubeLink', function () {
        it('gets a YouTube link and caches result', function () {
            lfm.getYouTubeLink('Clawfinger', 'Do What I Say', tgStub.mockSend);

            expect(tgStub.message).toEqual('https://www.youtube.com/watch?v=-1CE4P8qqPE');
            expect(tgStub.called).toBe(true);
            expect(lfmAPIStub.downloadFullPage.called).toBe(true);
            expect(youtube.get('Clawfinger', 'Do What I Say')).toEqual('https://www.youtube.com/watch?v=-1CE4P8qqPE');
        });
        it('returns link from cache', function () {
            lfm.getYouTubeLink('Clawfinger', 'Do What I Say', tgStub.mockSend);

            expect(tgStub.message).toEqual('https://www.youtube.com/watch?v=-1CE4P8qqPE');
            expect(tgStub.called).toBe(true);
            expect(lfmAPIStub.downloadFullPage.called).toBe(false);
        });
        it('gets a page without YouTube link and caches result', function () {
            lfm.getYouTubeLink('Korn', 'Trash', tgStub.mockSend);

            expect(tgStub.message).toEqual('No YouTube link found');
            expect(tgStub.called).toBe(true);
            expect(lfmAPIStub.downloadFullPage.called).toBe(true);
            expect(youtube.get('Korn', 'Trash')).toBe('No YouTube link found');
        });
        it('returns link from cache', function () {
            lfm.getYouTubeLink('Korn', 'Trash', tgStub.mockSend);

            expect(tgStub.message).toEqual('No YouTube link found');
            expect(tgStub.called).toBe(true);
            expect(lfmAPIStub.downloadFullPage.called).toBe(false);
        });
        it('gets a response with error', function () {
            lfm.getYouTubeLink('asddsaasd', 'ads', tgStub.mockSend);

            expect(tgStub.message).toEqual('Track not found');
        });
    });
});
