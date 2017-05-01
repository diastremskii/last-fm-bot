const fetch = require('node-fetch')
const YouTubeStore = require('../storage/youtube');

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
}

module.exports = LastfmExtra;