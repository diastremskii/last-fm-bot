const config = {};

config.PORT = process.env.PORT || 3000;

config.TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
config.WEBHOOK_BASE_PATH = process.env.WEBHOOK_BASE_PATH;

config.LFM_TOKEN = process.env.LFM_TOKEN;
config.LFM_AUTOCORRECT = process.env.LFM_AUTOCORRECT || 1;
config.SIMILAR_LIMIT = process.env.SIMILAR_LIMIT || 10;
config.TOP_LIMIT = process.env.TOP_LIMIT || 8;

config.REDIS_URL = process.env.REDIS_URL;
config.SESSION_TTL = process.env.SESSION_TTL || 60 * 60 * 24 * 10;
config.BUTTONS_TTL = process.env.SESSION_TTL || 60 * 60 * 24 * 10;
config.YOUTUBE_TTL = process.env.YOUTUBE_TTL || 60 * 60 * 24 * 30;

config.YOUTUBE_KEY = process.env.YOUTUBE_KEY;

module.exports = config;
