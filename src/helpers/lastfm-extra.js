const fetch = require('node-fetch')
const curryfm = require('curryfm');
const qs = require('querystring')

const config = require('../../config');
const YouTubeStore = require('../storage/youtube');

const lfm = curryfm.default(config.LFM_TOKEN);
const artist = lfm('artist');
const YOUTUBE_SEARCH = 'https://www.googleapis.com/youtube/v3/search';

class LastfmExtra {
  constructor () {

  }
  
  static getVideoId (artistName, track) {
    if (config.YOUTUBE_KEY === undefined) {
      return undefined;
    }

    return Promise.resolve(YouTubeStore.get(artistName, track))
      .then((cacheRes) => {
        if (cacheRes) {
          return cacheRes;
        };
        const query = qs.escape(`${artistName} ${track}`);
        return fetch(`${YOUTUBE_SEARCH}?part=snippet&q=${query}`
          + `&type=video&fields=items/id&key=${config.YOUTUBE_KEY}`)
          .then(res => res.json())
          .then(videos => {
            if (videos.error !== undefined) {
              return undefined;
            }

            // No error handling for setting keys is intensional.
            // If any error happens while setting the key - it can be ignored.
            if (videos.items.length === 0) {
              // Store zero to indicate what link wasn't found
              YouTubeStore.add(artistName, track, 0);
              return undefined;
            }
            YouTubeStore.add(artistName, track, videos.items[0].id.videoId);
            return videos.items[0].id.videoId;
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