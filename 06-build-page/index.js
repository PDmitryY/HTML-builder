const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = __dirname;
const COMPONENTS_FOLDER = `${ROOT_DIR}/components`;
const STYLES_FOLDER = `${ROOT_DIR}/styles`;
const ASSETS_FOLDER = `${ROOT_DIR}/assets`;
const DIST_FOLDER = `${ROOT_DIR}/project-dist`;

async function rmDir(folderPath) {
  try {
    await fs.rm(folderPath, { recursive: true });
  } catch (e) {
    if(e.code !== 'ENOENT') throw e;
  }
}

async function makeDir(distFolderPath) {
  try {
    await fs.mkdir(distFolderPath);
  } catch (e) {
    if(e.code !== 'EEXIST') throw e;
  }
}

async function generateIndex(templateFilePath, componentsFolderPath, outputFilePath) {
  try {
    let templateFile = (await fs.readFile(templateFilePath, 'utf8')).toString();
    const componentNames = [...templateFile.matchAll(/\{\{(.*)\}\}/gim)].map(aMatch => aMatch[1]);

    for(const componentName of componentNames) {
      let componentFile = (await fs.readFile(`${componentsFolderPath}/${componentName}.html`, 'utf8')).toString();
      templateFile = templateFile.replace(`{{${componentName}}}`, componentFile);
    }

    await fs.writeFile(outputFilePath, templateFile);
  } catch (e) {
    console.error('Failed to generate index.html');
    throw e;
  }
}

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
  await makeDir(DIST_FOLDER);
  await generateIndex(`${ROOT_DIR}/template.html`, COMPONENTS_FOLDER, `${DIST_FOLDER}/index.html`);
  await bundleCss(STYLES_FOLDER, `${DIST_FOLDER}/style.css`);
  await rmDir(`${DIST_FOLDER}/assets`);
  await copyDir(ASSETS_FOLDER, `${DIST_FOLDER}/assets`);
}

build();
