var config = {};

config.SERVER_PORT = process.env.PORT || 3000;

config.BOT_NAME = process.env.TELEGRAM_USERNAME;
config.TOKEN = process.env.TELEGRAM_TOKEN;
config.WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL;
config.BOT_WEBHOOK_PATH = '/telegramBot';

config.TELEGRAM_BASE_URL = 'api.telegram.org';
config.TELEGRAM_BASE_PATH = '/bot';
config.TELEGRAM_FULL_URL = 'https://' + config.TELEGRAM_BASE_URL + config.TELEGRAM_BASE_PATH + config.TOKEN;

config.LFM_URL = 'https://www.last.fm';
config.LFM_API_URL = 'http://ws.audioscrobbler.com/2.0/?method=';
config.LFM_TOKEN = process.env.LFM_TOKEN;
config.LFM_AUTOCORRECT = 1;
config.SIMILAR_LIMIT = 20;
config.TOP_TRACKS_LIMIT = 8;

module.exports = config;
