const { Router } = require('telegraf')
const curryfm = require('curryfm');
const co = require('co');

const CallbackStore = require('../storage/callback-store');
const Keyboard = require('../helpers/keyboard');
const config = require('../../config');

const lfm = curryfm.default(config.LFM_TOKEN);
const artist = lfm('artist');

/* Whole point of this generator is to stop iteration when at least
 * one argument is invalid. This will be a lot more simple when 
 * async/await hits LTS.
 * 
 */ 
const decodeArgs = co.wrap(function* (args) {
  let decoded = [];

  for (let idx = 0; idx < args.length; idx++) {
    if (args[idx].length === 22) {
      // Storage can be both sync and async. 
      // Promise.resolve used to make sync response thenable
      const decodedArg = yield Promise.resolve(CallbackStore.get(args[idx]));
      
      if (!decodedArg) return undefined;

      decoded.push(decodedArg);
    } else {
      decoded.push(args[idx]);
    }
  }
  
  return decoded;
});

const callbackRouter = new Router((ctx) => {
  if (!ctx.callbackQuery.data) {
    return Promise.resolve();
  }
  const parts = ctx.callbackQuery.data.split(':');
  const args = parts.slice(1);

  return decodeArgs(args)
    .then((decodedArgs) => {
      if (!decodedArgs) {
        return Promise.resolve({
          route: 'outdated'
        })
      }
      return Promise.resolve({
        route: parts[0],
        state: {
          args: decodedArgs
        }
      })
    })
});

callbackRouter.on('outdated', (ctx) => {
  return ctx.answerCallbackQuery('Sorry, this button doesn\'t work anymore');
})

callbackRouter.on('artist', (ctx) => {
  ctx.session.artist = ctx.state.args[0];
  ctx.flow.enter('artistMenu');
  return ctx.answerCallbackQuery();
})

callbackRouter.on('album', (ctx) => {
  ctx.session.artist = ctx.state.args[0];
  ctx.session.album = ctx.state.args[1];
  ctx.flow.enter('albumMenu');
  return ctx.answerCallbackQuery();
})

callbackRouter.on('track', (ctx) => {
  ctx.session.artist = ctx.state.args[0];
  ctx.session.track = ctx.state.args[1];
  ctx.flow.enter('trackMenu');
  return ctx.answerCallbackQuery();
})

// Args for next/prev page methods
// args[0] - current page number
// args[1] - artist name
callbackRouter.on('trackPrevPage', (ctx) => {
  if (ctx.state.args[0] === `1`) {
    return ctx.answerCallbackQuery('You are on first page');
  };
  const newPage = ctx.state.args[0] - 1;
  return moveToPage('getTopTracks', newPage, ctx.state.args[1])
    .then(res => {
      return ctx.editMessageReplyMarkup(
        Keyboard.tracksNav(res.toptracks.track, newPage))
    });
})

callbackRouter.on('trackNextPage', (ctx) => {
  const newPage = +ctx.state.args[0] + 1;
  return moveToPage('getTopTracks', newPage, ctx.state.args[1])
    .then(res => {
      if (!res.toptracks.track.length) {
        return ctx.answerCallbackQuery('You are on last page');
      }
      return ctx.editMessageReplyMarkup(
        Keyboard.tracksNav(res.toptracks.track, newPage))
    });
})

callbackRouter.on('albumPrevPage', (ctx) => {
  if (ctx.state.args[0] === `1`) {
    return ctx.answerCallbackQuery('You are on first page');
  };
  const newPage = ctx.state.args[0] - 1;
  return moveToPage('getTopAlbums', newPage, ctx.state.args[1])
    .then(res => {
      return ctx.editMessageReplyMarkup(
        Keyboard.albumsNav(res.topalbums.album, newPage))
    });
})

callbackRouter.on('albumNextPage', (ctx) => {
  const newPage = +ctx.state.args[0] + 1;
  return moveToPage('getTopAlbums', newPage, ctx.state.args[1])
    .then(res => {
      if (!res.topalbums.album.length) {
        return ctx.answerCallbackQuery('You are on last page');
      }
      return ctx.editMessageReplyMarkup(
        Keyboard.albumsNav(res.topalbums.album, newPage))
    });
})

function moveToPage(method, page, artistName) {
  return artist(method, {
    artist: artistName,
    autocorrect: config.LFM_AUTOCORRECT,
    page: page,
    limit: config.TOP_LIMIT,
    format: 'json'
  })
}

module.exports = callbackRouter;
