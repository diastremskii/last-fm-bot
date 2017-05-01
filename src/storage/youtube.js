const crypto = require('crypto');
const config = require('../../config');
const redis = require('redis');

// Key for YouTube URL's is Last.fm URL of track


class YouTubeMemory {
  constructor() {
    this.data = new Map();
  }

  add(url, youtubeLink) {
    if (!this.data.has(url)) {
      this.data.set(url, youtubeLink);
    }
    return url;
  }

  get(url) {
    return this.data.get(url);
  }
}

class YouTubeRedis {
  constructor() {
    this.client = redis.createClient(config.REDIS_URL);
    this.client.ttl = (key) => this.client.expire(key, config.YOUTUBE_TTL);
  }

  add(url, youtubeLink) {
    return new Promise((resolve, reject) => {
      this.client.set(url, youtubeLink, (err) => {
        if (err) {
          reject();
        }
        this.client.ttl(url);
        resolve(url);
      })
    });
  }

  get(url) {
    return new Promise((resolve, reject) => {
      this.client.get(url, (err, reply) => {
        if (!reply || err) {
          reject();
        }
        resolve(reply);
      })
    });
  }
}

let instance;

if (config.REDIS_URL) {
  instance = new YouTubeRedis();
} else {
  instance = new YouTubeMemory();
}

module.exports = instance;
