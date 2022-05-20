const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const pathFileParse = path.parse(path.join(__dirname, 'secret-folder', file.name));
        fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
          console.log(`${pathFileParse.name} - ${pathFileParse.ext.slice(1)} - ${stats.size}b`) ;
        }); 
      }
    }
  } catch (err) {
    console.error(err);
  }
})();