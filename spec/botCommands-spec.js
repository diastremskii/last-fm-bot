'use strict'

var proxyquire = require('proxyquire');
var tgStub = require('./stubs/telegramAPIStub');
var lfmStub = require('./stubs/lfmControllerStub');

var botCommands = proxyquire('../modules/botCommands', {
    './telegramAPI': tgStub,
    './lfmController': lfmStub
});


//Cut
var exampleMessage = {
    chat: {
        id: 1
    }
};

describe('Module containing bot commands', function () {
    beforeEach(function() {
        tgStub.reset();
        lfmStub.reset();
    });
    describe('/artpic command', function () {
        it('gets called with parameter', function () {
            botCommands['/artpic']('Zaz', exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(tgStub.message).toEqual('Zaz');
            expect(tgStub.chatId).toEqual(1);
        });
        it('gets called without parameter', function () {
            botCommands['/artpic']('', exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
        });
    });
    describe('/sa command', function () {
        it('gets called with parameter', function () {
            botCommands['/sa']('Depeche Mode', exampleMessage);

            expect(tgStub.called).toBe(true);
            expect(tgStub.message).toEqual('Depeche Mode');
            expect(tgStub.chatId).toEqual(1);
        });
        it('gets called without parameter', function () {
            botCommands['/sa']('', exampleMessage);

            expect(lfmStub.called).toBe(false);
            expect(tgStub.called).toEqual(true);
        });
    });
    it('gets a /start command without parameter', function () {
        botCommands['/start']('', exampleMessage);

        expect(tgStub.called).toEqual(true);
    });
    it('gets a /help command without parameter', function () {
        botCommands['/help']('', exampleMessage);

        expect(tgStub.called).toEqual(true);
    });
});
