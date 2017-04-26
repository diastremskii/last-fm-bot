const Telegraf = require('telegraf');
const TelegrafFlow = require('telegraf-flow');
const RedisSession = require('telegraf-session-redis')

const callbackRouter = require('./routers/callback-router');

const config = require('../config');

const flow = new TelegrafFlow();

flow.command('start', (ctx) => ctx.flow.enter('startMenu'));

const sceneFilenames = [
  'start-menu',
  'artist-wizard',
  'artist-menu',
  'album-menu',
  'track-menu'
];

const scenes = sceneFilenames.map(sceneName => {
  const scene = require(`./scenes/${sceneName}`);
  flow.register(scene);
  return scene;
})

const app = new Telegraf(config.TELEGRAM_TOKEN);

app.telegram.getMe().then((botInfo) => {
  app.options.username = botInfo.username
});

if (config.REDIS_URL) {
  const session = new RedisSession({
    store: {
      url: config.REDIS_URL
    },
    ttl: config.SESSION_TTL
  });
  app.use(session.middleware())
} else {
  app.use(Telegraf.memorySession());
}

app.use(flow.middleware());

app.on('callback_query', callbackRouter.middleware())

// In case context was lost
app.on('text', ctx => {
  ctx.reply('Sorry, your previous session has expired! Try again please')
    .then(() => ctx.flow.enter('startMenu'));
});

app.catch((err) => {
  if (err.code) {
    console.log(`${err.description}, code ${err.code}, at ${new Date()}`);
  } else {
    throw err;
  }
});

app.telegram.setWebhook(
  `${config.WEBHOOK_BASE_PATH}/bot${config.TELEGRAM_TOKEN}`
);
app.startWebhook(`/bot${config.TELEGRAM_TOKEN}`, null, config.PORT);