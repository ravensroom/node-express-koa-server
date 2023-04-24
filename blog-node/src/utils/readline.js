const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filename = path.join(__dirname, '../', '../', 'logs', 'access.log');
const readStream = fs.createReadStream(filename);

const rl = readline.createInterface({
  input: readStream,
});

let chromeNum = 0;
let num = 0;

rl.on('line', (lineData) => {
  if (!lineData) return;
  num++;

  const arr = lineData.split(' -- ');
  if (arr[2] && arr[2].indexOf('Chrome') > 0) {
    chromeNum++;
  }
});

rl.on('close', () => {
  console.log('Chrome user percentage: ', chromeNum / num);
});
