'use strict'

var proxyquire = require('proxyquire');
var tgStub = require('./stubs/telegramAPIStub');
var botCommandsStub = require('./stubs/botCommandsStub');

var bot = proxyquire('../modules/bot', {
  './telegram/telegramAPI': tgStub,
  './botCommands': botCommandsStub
});

var tgRequests = require('./data/telegramRequests');

describe('Main bot logic', function(){
    beforeEach(function() {
      botCommandsStub.reset();
    });
    it('gets a normal command', function() {
        bot.verifyRequest(tgRequests.artPic);

        expect(botCommandsStub.called).toBe(true);
        expect(botCommandsStub.artist).toEqual('The Smashing Pumpkins');
        expect(botCommandsStub.username).toEqual('test');
    });
    it('gets an empty message', function () {
        bot.verifyRequest(tgRequests.empty);

        expect(botCommandsStub.called).toBe(false);
    });
    it('gets an non-existsing comand', function () {
        bot.verifyRequest(tgRequests.nonExisting);

        expect(botCommandsStub.called).toBe(false);
        expect(tgStub.chatId).toEqual(1);
        expect(tgStub.message).toEqual('Command /asd does not exist');
    });
    it('gets called with username (i.e. in group)', function () {
        bot.verifyRequest(tgRequests.withUsername);

        expect(botCommandsStub.called).toBe(true);
        expect(botCommandsStub.artist).toEqual('Foo Fighters');
        expect(botCommandsStub.username).toEqual('test');
    });
});
