const fs = require('fs/promises');
const path = require('path');
const dirPathFrom = path.join(__dirname, 'files');
const dirPathTo = path.join(__dirname, 'files-copy');

async function rmDir(folderPath) {
  try {
    await fs.rm(folderPath, { recursive: true });
  } catch (e) {
    if(e.code !== 'ENOENT') throw e;
  }
}

async function makeDir(distFolderPath) {
  try {
    await fs.mkdir(distFolderPath, {recursive: true});
  } catch (e) {
    if(e.code !== 'EEXIST') throw e;
  }
}

async function copyDir(dirPathFrom, dirPathTo) {
  try {
    await makeDir(dirPathTo);

    const files = await fs.readdir(dirPathFrom, {withFileTypes: true});
    for(const file of files) {
      if (file.isFile()) {
        await fs.copyFile(path.join(dirPathFrom, file.name), path.join(dirPathTo, file.name));
      } else if(file.isDirectory()) {
        await copyDir(`${dirPathFrom}/${file.name}`, `${dirPathTo}/${file.name}`);
      }
    }
  } catch (err) {
    console.error('Failed to copy files');
    throw err;
  }
}

async function build() {
  await rmDir(dirPathTo);
  await makeDir(dirPathTo);
  await copyDir(dirPathFrom, dirPathTo);;
}

build();