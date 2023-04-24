const redis = require('redis');
const { REDIS_CONF } = require('../conf/db.js');
const client = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await client
    .connect()
    .then(console.log('redis connection success'))
    .catch((err) => console.log(err));
})();

async function set(key, val) {
  let objVal;
  if (typeof val === 'object') {
    objVal = JSON.stringify(val);
  } else {
    objVal = val;
  }
  await client.set(key, objVal);
}

async function get(key) {
  try {
    let val = await client.get(key);

    if (val == null) return val;

    try {
      val = JSON.parse(val);
    } catch (err) {}

    return val;
  } catch (err) {
    throw err;
  }
}

module.exports = { set, get };
