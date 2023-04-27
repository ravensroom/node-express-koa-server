const redis = require('redis');

const { REDIS_CONF } = require('../conf/db');

const client = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await client
    .connect()
    .then(console.log('redis connection success'))
    .catch((err) => console.log(err));
})();

module.exports = client;
