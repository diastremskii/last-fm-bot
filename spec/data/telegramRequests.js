'use strict'

var requests = {};

requests.artPic = {
    update_id: 1,
    message: {
        message_id: 1,
        from: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test'
        },
        chat: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test',
            type: 'private'
        },
        date: Date.now(),
        text: '/artpic The Smashing Pumpkins'
    }
};

requests.empty = {
    update_id: 1,
    message: {
        message_id: 1,
        from: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test'
        },
        chat: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test',
            type: 'private'
        },
        date: Date.now(),
        text: ''
    }
};

requests.nonExisting = {
    update_id: 1,
    message: {
        message_id: 1,
        from: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test'
        },
        chat: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test',
            type: 'private'
        },
        date: Date.now(),
        text: '/asd'
    }
};

requests.withUsername = {
    update_id: 1,
    message: {
        message_id: 1,
        from: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test'
        },
        chat: {
            id: 1,
            first_name: 'test',
            last_name: 'test',
            username: 'test',
            type: 'private'
        },
        date: Date.now(),
        text: '/artpic@' + process.env.TELEGRAM_USERNAME +' Foo Fighters'
    }
};

module.exports = requests;
