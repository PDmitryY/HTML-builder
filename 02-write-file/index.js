const fs = require('fs');
const path = require('path');

const process = require('process');

(async () => {
  fs.writeFile(path.join(__dirname, 'text.txt'), '',
    (err) => {
      if (err) throw err;
      console.log('Напишите что-нибудь...');
      process.stdin.on('data', data => {
        if (data.toString().trim() == 'exit') {process.exit();}
        fs.appendFile(path.join(__dirname, 'text.txt'), data,
          (err,) => {
            if (err) throw err;
            console.log('Еще что-нибудь?');
          });
      });
    });
  process.on('SIGINT', () => {process.exit();});
  process.on('exit', () => {return console.log('Благодарю за то, что уделили время. До свидания.');});
})();

