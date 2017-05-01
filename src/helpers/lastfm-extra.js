const fetch = require('node-fetch')
const curryfm = require('curryfm');

const config = require('../../config');
const YouTubeStore = require('../storage/youtube');

const lfm = curryfm.default(config.LFM_TOKEN);
const artist = lfm('artist');

class LastfmExtra {
  constructor () {

  }

  static youtube (url) {
    return Promise.resolve(YouTubeStore.get(url))
      .then((cacheRes) => {
        if (cacheRes) {
          return cacheRes;
        };
        return fetch(url)
          .then(res => res.text())
          .then(page => page.match(/data-youtube-url="(.+)"/))
          .then(match => {
            // No error handling for setting keys is intensional.
            // If any error happens while setting the key - it can be ignored.
            if (match === null) {
              // Store zero to indicate what link wasn't found
              YouTubeStore.add(url, 0);
              return undefined;
            }
            YouTubeStore.add(url, match[1]);
            return match[1];
          }) 
      })
  }

  // Because of Last.fm API bug response for big page numbers can be empty
  static randomTrack (artistName, total) {
    const limit = total > 1000 ? 1000 : total;
    const randomTrack = Math.ceil(Math.random() * limit - 1) + 1;
    return artist('getTopTracks', {
      artist: artistName,
      autocorrect: config.LFM_AUTOCORRECT,
      limit: 1,
      page: randomTrack,
      format: 'json'
    }).then(res => {
      
      if (res.toptracks.track.length === 0) {
        return LastfmExtra.randomSong(artistName, total)
      }

      return res.toptracks.track[0];
    })
  }
}

module.exports = LastfmExtra;