const { Markup } = require('telegraf');
const CallbackStore = require('../storage/callback-store');

class Keyboard {
  constructor() {

  }

  static albums(albums) {
    return Keyboard.list(albums, 'album')
  }

  static tracks(tracks) {
    return Keyboard.list(tracks, 'track')
  }

  static albumsNav(albums, page = 1) {
    return Keyboard.nav(albums, 'album', page);
  }

  static tracksNav(tracks, page = 1) {
    return Keyboard.nav(tracks, 'track', page);
  }

  static list(items, itemType, columns = 2) {
    return Markup.inlineKeyboard(
      Keyboard.listButtons(items, itemType),
      {columns: columns}
    );
  }

  static nav(items, itemType, page) {
    return Markup.inlineKeyboard(
      Keyboard.listButtons(items, itemType)
        .concat(Keyboard.navButtons(items[0].artist.name, itemType, page)),
      {columns: 2}
    );
  }

  static similarTracks(items) {
    return Markup.inlineKeyboard(items.map(item => {
      return Markup.callbackButton(
        `${item.artist.name} - ${item.name}`,
        `track:${CallbackStore.add(item.artist.name)}:` +
          `${CallbackStore.add(item.name)}`
      )
    }), {columns: 2});
  }
  
  static similarArtits(artists) {
    return Markup.inlineKeyboard(artists.map(artist => {
      return Markup.callbackButton(
        artist.name,
        `artist:${CallbackStore.add(artist.name)}`
      );
    }), {columns: 2});
  }

  static navButtons(artist, itemType, page) {
    return [
      Markup.callbackButton('⬅️',
        `${itemType}PrevPage:${page}:${CallbackStore.add(artist)}`),
      Markup.callbackButton('➡️',
        `${itemType}NextPage:${page}:${CallbackStore.add(artist)}`)
    ];
  }

  static listButtons(items, itemType) {
    return items.map(item => {
      return Markup.callbackButton(
        item.name,
        `${itemType}:${CallbackStore.add(item.artist.name)}:` +
          `${CallbackStore.add(item.name)}`
      )
    });
  }
}

module.exports = Keyboard;
