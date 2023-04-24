const fs = require('fs');
const path = require('path');

const writeLog = (writeStream, log) => {
  writeStream.write(log + '\n');
};

const createWriteStream = (filename) => {
  const fullFileName = path.join(__dirname, '../', '../', 'logs', filename);
  const writeStream = fs.createWriteStream(fullFileName, { flags: 'a' });
  return writeStream;
};

const accessWriteStream = createWriteStream('access.log');
const errorWriteStream = createWriteStream('error.log');
const eventWriteStream = createWriteStream('event.log');

const access = (log) => {
  writeLog(accessWriteStream, log);
};

module.exports = {
  access,
};
