const fs = require('fs');
const path = require('path');

(async () => {
  fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '',
    async (err) => {
      if (err) throw err;
      const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
      let text = '';
      for(const file of files) {
        if (file.isFile()) {
          const pathFileParse = path.parse(path.join(__dirname, 'styles', file.name));
          if (pathFileParse.ext == '.css') {
            let readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
            readStream.on('data', (chunk) => {text += chunk.toString();});
            readStream.on('end', () => {
              fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), text,
                (err,) => {
                  if (err) throw err;
                });
            });
          }
        }
      }
    });
})();