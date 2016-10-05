# Last.fm bot
![Heroku](https://heroku-badge.herokuapp.com/?app=lastfmbot&root=status&style=flat)

A telegram bot to interact with Last.fm. Created without any dependencies (except test dependencies) for educational purposes only. Live version: https://telegram.me/l_fmbot

At the moment there is not much this bot can do.

1. You can get a picture of an artist with /artpic *artist*
2. You can get similar artists with /sa *artist*

But more commands will come soon. Expect command changes.

Hosted on Heroku with free account, so expect slight latency.

## Deploy on heroku

1. Create a new heroku app.
2. Select GitHub as deployment method and connect it to this or to your repository.
3. Create a new bot account with [BotFather](https://telegram.me/BotFather).
4. Go to your heroku app settings page and create the following config variables:
- TELEGRAM_TOKEN: the token you received from the BotFather.
- TELEGRAM_USERNAME: the username of your bot.
- WEBHOOK_BASE_URL: your heroku app url *https://your-heroku-app-name.herokuapp.com*

## Run tests
1. Install jasmine globally:
    ```
    npm install -g jasmine
    ```
2. Run tests:
    ```
    npm test
    ```
