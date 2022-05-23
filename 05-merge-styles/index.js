const fs = require('fs/promises');
const path = require('path');
const stylesFolderPath = path.join(__dirname, 'styles');
const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleCss(stylesFolderPath, outputFilePath) {
  try {
    let allCssString = '';
    for(const file of await fs.readdir(stylesFolderPath)) {
      const pathFileParse = path.parse(`${stylesFolderPath}/${file.toString()}`);
      if (pathFileParse.ext == '.css') {
        allCssString += (await fs.readFile(`${stylesFolderPath}/${file.toString()}`, 'utf8')).toString() + '\n';
      }
    }
    await fs.writeFile(outputFilePath, allCssString);
  } catch (e) {
    console.error('Failed to bundle css');
    throw e;
  }
}

bundleCss(stylesFolderPath, outputFilePath);