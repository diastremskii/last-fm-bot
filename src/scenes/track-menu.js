const { Markup, Extra } = require('telegraf');
const { Scene } = require('telegraf-flow');
const curryfm = require('curryfm');

const config = require('../../config');
const Format = require('../helpers/format');
const Keyboard = require('../helpers/keyboard');
const LastfmExtra = require('../helpers/lastfm-extra');

const lfm = curryfm.default(config.LFM_TOKEN);
const track = lfm('track');
const artist = lfm('artist');

const trackMenu = new Scene('trackMenu');

//Don't forget to change .hears handler after modifying this array
const trackKeyboardButtons = [
  ['❕ Info', '🎼 Similar tracks'],
  ['🎥 YouTube video', '⬅️ Back' ],
];

const trackKeyboard = Markup
  .keyboard(trackKeyboardButtons)
  .resize()
  .extra();

trackMenu.enter((ctx) => {
  ctx.replyWithHTML(
    `What would you like to find out about track ` +
      `<b>${ctx.session.artist}</b> - <b>${ctx.session.track}</b>?`,
    trackKeyboard
  )
})
trackMenu.hears('❕ Info', (ctx) => {
  track('getInfo', {
    artist: ctx.session.artist,
    track: ctx.session.track,
    autocorrect: config.LFM_AUTOCORRECT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };
    return ctx.replyWithHTML(Format.track(res.track), Extra.webPreview(false));
  })
})
trackMenu.hears('🎼 Similar tracks', (ctx) => {
  track('getSimilar', {
    artist: ctx.session.artist,
    track: ctx.session.track,
    autocorrect: config.LFM_AUTOCORRECT,
    limit: config.SIMILAR_LIMIT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    }
    if (res.similartracks.track.length === 0) {
      return ctx.reply('No tracks found');
    }

    return ctx.reply('Similar tracks:',
      Keyboard.similarTracks(res.similartracks.track).extra());
  })
})
trackMenu.hears('🎥 YouTube video', (ctx) => {
  return LastfmExtra.getVideoId(ctx.session.artist, ctx.session.track)
    .then(videoId => {
      if (videoId === undefined) {
        return ctx.reply('Sorry, no YouTube video were found');
      }
      return ctx.reply('Video can be incorrect. (Sorry!) \n ' 
        + `https://youtube.com/watch?v=${videoId}`);
    })
})
trackMenu.hears('⬅️ Back', (ctx) => {
  ctx.flow.enter('artistMenu');
})
module.exports = trackMenu;
