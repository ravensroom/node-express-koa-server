const crypto = require('crypto');

const SECRET_KEY = 'WJiol_9776#';

function md5(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

module.exports = { genPassword };
