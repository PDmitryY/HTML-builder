const fs = require('fs');
const path = require('path');

let text = '';
const textPath = path.join(__dirname, 'text.txt');

(async () => {
  const readStream = fs.createReadStream(textPath);
  readStream.on('data', (chunk) => {text += chunk.toString();});
  readStream.on('end', () => console.log(text));
})();