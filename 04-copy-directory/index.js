const fs = require('fs');
const path = require('path');

async function copyDir () {
  try {
    fs.promises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true});

    fs.readdir(path.join(__dirname, 'files-copy'), (err, filesCopy) => {
      if (err) throw err;
      for (const fileCopy of filesCopy) {
        fs.unlink(path.join(__dirname, 'files-copy', fileCopy), err => {
          if (err) throw err;
        });
      }
    });
    
    const files = await fs.promises.readdir(path.join(__dirname, 'files'), {withFileTypes: true});
    for(const file of files) {
      console.log(file);
      if (file.isFile()) {
        await fs.promises.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir();