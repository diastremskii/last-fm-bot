const crypto = require('crypto');
const config = require('../../config');
const redis = require('redis');

//Maximum allowed size for button callback data - 64 bytes
//MD5 in Base64 - 24 bytes

function base64urlEncode(string) {
  // https://tools.ietf.org/html/rfc4648#page-7
  // https://en.wikipedia.org/wiki/Base64#URL_applications
  const hashedString =
    crypto.createHash('md5').update(string).digest('base64');
  const replacements = [
    [/\+/g, '-'],
    [/\//g, '_'],
    // MD5 always have same length, so it's safe to remove padding
    // Also padding for MD5 is always 2 spaces, so it could be return if needed
    [/=/g, ''] 
  ];
  return replacements.reduce((hashedString, replacement) => {
    return hashedString.replace(replacement[0], replacement[1])
  }, hashedString);
};


class CallbackStoreMemory {
  constructor() {
    this.data = new Map();
  }

  add(data) {
    const hashedData = base64urlEncode(data);
    if (!this.data.has(hashedData)) {
      this.data.set(hashedData, data);
    }
    return hashedData;
  }

  get(hashedData) {
    return this.data.get(hashedData);
  }
}

class CallbackStoreRedis {
  constructor() {
    this.client = redis.createClient(config.REDIS_URL);
    this.client.ttl = (key) => this.client.expire(key, config.BUTTONS_TTL);
  }

  add(data) {
    const hashedData = base64urlEncode(data);
    /*
     * Yes, this is intentional. 
     */
    this.client.set(hashedData, data).then(() => this.client.ttl(hashedData));
    /*          ^^^
     * Redis set is async and function returns before data is actualy set.
     * Data is added with Keyboard helper (because hashed data is sent with
     * button callback) and creating sort of async keyboards would be 
     * really awkward. So if users will get non-working button instead of
     * error message if Redis fails sounds not like a big deal
     */
    return hashedData;
  }

  get(hashedData) {
    return new Promise((resolve, reject) => {
      this.client.get(hashedData, (err, reply) => {
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
  instance = new CallbackStoreRedis();
} else {
  instance = new CallbackStoreMemory();
}

module.exports = instance;
