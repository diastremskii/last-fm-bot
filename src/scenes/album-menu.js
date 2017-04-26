const { Markup, Extra } = require('telegraf');
const { Scene } = require('telegraf-flow');
const curryfm = require('curryfm');

const config = require('../../config');
const Format = require('../helpers/format');
const Keyboard = require('../helpers/keyboard');

const lfm = curryfm.default(config.LFM_TOKEN);
const album = lfm('album');

const albumMenu = new Scene('albumMenu');

//Don't forget to change .hears handler after modifying this array
const albumKeyboardButtons = [
  ['❕ Info', '🎼 Tracks'],
  ['⬅️ Back']
];

const albumKeyboard = Markup
  .keyboard(albumKeyboardButtons)
  .resize()
  .extra();

albumMenu.enter((ctx) => {
  ctx.replyWithHTML(
    `What would you like to find out about album <b>${ctx.session.album}</b>?`,
    albumKeyboard
  )
})
albumMenu.hears('❕ Info', (ctx) => {
  album('getInfo', {
    artist: ctx.session.artist,
    album: ctx.session.album,
    autocorrect: config.LFM_AUTOCORRECT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };
    if (res.album.image[4]['#text']){
      return ctx.reply(res.album.image[4]['#text']).then(() =>
        ctx.replyWithHTML(Format.album(res.album), Extra.webPreview(false)));
    };
    ctx.replyWithHTML(Format.album(res.album), Extra.webPreview(false));
  })
})
albumMenu.hears('🎼 Tracks', (ctx) => {
  album('getInfo', {
    artist: ctx.session.artist,
    album: ctx.session.album,
    autocorrect: config.LFM_AUTOCORRECT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };

    ctx.reply('Tracks:', Keyboard.tracks(res.album.tracks.track).extra());
  })
})
albumMenu.hears('⬅️ Back', (ctx) => {
  ctx.flow.enter('artistMenu');
})

module.exports = albumMenu;
