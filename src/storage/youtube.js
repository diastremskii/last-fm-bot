const crypto = require('crypto');
const config = require('../../config');
const redis = require('redis');

// Key for YouTube URL's is artist+track


class YouTubeMemory {
  constructor() {
    this.data = new Map();
  }

  add(artist, track, youtubeLink) {
    const key = artist + track;
    if (!this.data.has(key)) {
      this.data.set(key, youtubeLink);
    }
    return true;
  }

  get(artist, track) {
    const key = artist + track;
    return this.data.get(key);
  }
}

class YouTubeRedis {
  constructor() {
    this.client = redis.createClient(config.REDIS_URL);
    this.client.ttl = (key) => this.client.expire(key, config.YOUTUBE_TTL);
  }

  add(artist, track, youtubeLink) {
    const key = artist + track;
    return new Promise((resolve, reject) => {
      this.client.set(key, youtubeLink, (err) => {
        if (err) {
          reject();
        }
        this.client.ttl(key);
        resolve(true);
      })
    });
  }

  get(url) {
    const key = artist + track;
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
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
