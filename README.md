# Last.fm bot
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](LICENSE)
[![Build Status](https://travis-ci.org/TheBeastOfCaerbannog/last-fm-bot.svg?branch=master)](https://travis-ci.org/TheBeastOfCaerbannog/last-fm-bot)

![Last.fm bot](http://i.imgur.com/r3GE1bw.png)

A telegram bot to interact with Last.fm. Created using telegraf framework+telegraf-flow. Bot can provide a lot of information about artists, albums, tracks, tags and can be used as handy music browser. 

Two types of storage supported: in-memory and Redis.

## Deploy

1. Create a new bot account with [BotFather](https://telegram.me/BotFather).
2. Upload bot to your hosting.
3. Change webhook settings if you would like to use self-signed certificate (or maybe just use polling)
4. Set following environment variables:
 - TELEGRAM_TOKEN: the token you received from the BotFather.
 - WEBHOOK_BASE_PATH: full url to your bot without trailing slash *https://your-bot.example.com*
 - LFM_TOKEN: your API key from Last.fm
5. If you want to, you can also set optional variables (or you can just stick with defaults):
 - PORT - port for your bot (default - 3000)
 - REDIS_URL - URL to Redis server if you would like to have persistent sessions and buttons
 - LFM_AUTOCORRECT - autocorrect misspelled queries to Last.fm API (default - 1)
 - SIMILAR_LIMIT - number of similar artists to show (default - 10)
 - TOP_LIMIT - number of top tracks/albums to show. (default - 8)
 - SESSION_TTL - number in seconds to keep session in Redis. (default - 10 days)
 - BUTTONS_TTL - number in seconds to keep buttons in Redis. (default - 10 days)
 - YOUTUBE_TTL - number in seconds to keep YouTube links cache in Redis. (default - 30 days) 