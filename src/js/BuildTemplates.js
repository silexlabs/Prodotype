#!/usr/bin/env node

// this script loads all templates (ejs and yml file)
// copies all ejs in the dest folder
// and creates a json file for all the templates configs

const path = require('path');
const fs = require('fs');
const yaml = require("js-yaml");

class BuilTemplates {
  static main() {
    console.log('Building...');
    let src = path.resolve(__dirname, '../templates');
    let dst = path.resolve(__dirname, '../../pub/components');
    let allComponentsJson = {};
    fs.readdirSync(src).map(function (file) {
      return path.join(src, file);
    }).filter(function (file) {
      return fs.statSync(file).isFile()
        && path.extname(file) === '.ejs';
    }).forEach(function (file) {
      let name = path.basename(file, '.ejs');
      console.log("Building template", name);
      let json = yaml.safeLoad(fs.readFileSync(path.resolve(src, name + '.yml')));
      allComponentsJson[name] = json;
      fs.createReadStream(file).pipe(fs.createWriteStream(path.resolve(dst, name + '.ejs')));
    });
    console.log('writing', dst + '/components.json', JSON.stringify(allComponentsJson));
    fs.writeFileSync(dst + '/components.json', JSON.stringify(allComponentsJson));
  }
}

BuilTemplates.main();
