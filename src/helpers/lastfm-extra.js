const fetch = require('node-fetch')

class LastfmExtra {
  constructor () {

  }

  static youtube (url) {
    return fetch(url)
      .then(res => res.text())
      .then(page => page.match(/data-youtube-url="(.+)"/))
      .then(match => match ? match[1] : undefined)
  }
}

module.exports = LastfmExtra;