const { Markup, Extra } = require('telegraf');
const { Scene } = require('telegraf-flow');
const curryfm = require('curryfm');

const config = require('../../config');
const Format = require('../helpers/format');
const Keyboard = require('../helpers/keyboard');
const LastfmExtra = require('../helpers/lastfm-extra');

const lfm = curryfm.default(config.LFM_TOKEN);
const artist = lfm('artist');

//Don't forget to change .hears handler after modifying this array
const artistKeyboardButtons = [
  ['❕ Info', '🎧 Similar artists'],
  ['📀 Top albums', '❤️ Top tracks'],
  ['🎲 Random track', '⬅️ Back']
];

const artistKeyboard = Markup
  .keyboard(artistKeyboardButtons)
  .resize()
  .extra();

const artistMenu = new Scene('artistMenu');

artistMenu.enter((ctx) => {
  ctx.replyWithHTML(
    `What would you like to find out about <b>${ctx.session.artist}</b>?`,
    artistKeyboard
  )
})

artistMenu.hears('❕ Info', (ctx) => {
  artist('getInfo', {
    artist: ctx.session.artist,
    autocorrect: config.LFM_AUTOCORRECT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };
    if (res.artist.image[4]['#text']){
      return ctx.reply(res.artist.image[4]['#text']).then(() =>
        ctx.replyWithHTML(Format.artist(res.artist), Extra.webPreview(false)));
    };
    ctx.replyWithHTML(Format.artist(res.artist), Extra.webPreview(false));
  })
})
artistMenu.hears('🎧 Similar artists', (ctx) => {
  artist('getSimilar', {
    limit: config.SIMILAR_LIMIT,
    artist: ctx.session.artist,
    autocorrect: config.LFM_AUTOCORRECT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };
    if (res.similarartists.artist.length === 0) {
      return ctx.reply('No artists found');
    }

    ctx.reply('Similar artists:',
      Keyboard.similarArtits(res.similarartists.artist).extra());
  })
})
artistMenu.hears('📀 Top albums', (ctx) => {
  artist('getTopAlbums', {
    artist: ctx.session.artist,
    autocorrect: config.LFM_AUTOCORRECT,
    limit: config.TOP_LIMIT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };
    if (res.topalbums.album.length === 0) {
      return ctx.reply('No albums found');
    }

    ctx.reply('Top albums:', Keyboard.albumsNav(res.topalbums.album).extra());
  })
})
artistMenu.hears('❤️ Top tracks', (ctx) => {
  artist('getTopTracks', {
    artist: ctx.session.artist,
    autocorrect: config.LFM_AUTOCORRECT,
    limit: config.TOP_LIMIT,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };
    if (res.toptracks.track.length === 0) {
      return ctx.reply('No tracks found');
    }

    ctx.reply('Top tracks:', Keyboard.tracksNav(res.toptracks.track).extra());
  })
})
artistMenu.hears('🎲 Random track', (ctx) => {
  artist('getTopTracks', {
    artist: ctx.session.artist,
    autocorrect: config.LFM_AUTOCORRECT,
    limit: 1,
    format: 'json'
  }).then(res => {
    if (res.error) {
      return ctx.reply(res.message);
    };
    return res.toptracks['@attr'].totalPages
  }).then(totalPages => {
    return LastfmExtra.randomTrack(ctx.session.artist, totalPages)
  }).then(track => {
    ctx.session.artist = track.artist.name;
    ctx.session.track = track.name;
    ctx.flow.enter('trackMenu');
  })
})
artistMenu.hears('⬅️ Back', (ctx) => {
  ctx.flow.enter('startMenu');
})
module.exports = artistMenu;
