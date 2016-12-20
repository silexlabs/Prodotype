#!/usr/bin/env node

// this script loads all templates (ejs and yml file)
// copies all ejs in the dest folder
// and creates a json file for all the templates configs

var path = require('path');
var fs = require('fs');
var yaml = require("js-yaml");

console.log('Building...');
var src = path.resolve(__dirname, '../templates');
var dst = path.resolve(__dirname, '../../pub/components');
var allComponentsJson = {};
fs.readdirSync(src).map(function (file) {
  return path.join(src, file);
}).filter(function (file) {
  return fs.statSync(file).isFile()
    && path.extname(file) === '.ejs';
}).forEach(function (file) {
  var name = path.basename(file, '.ejs');
  console.log("Building template", name);
  var json = yaml.safeLoad(fs.readFileSync(path.resolve(src, name + '.yml')));
  allComponentsJson[name] = json;
  fs.createReadStream(file).pipe(fs.createWriteStream(path.resolve(dst, name + '.ejs')));
});
console.log('writing', dst + '/components.json');
fs.writeFileSync(dst + '/components.json', JSON.stringify(allComponentsJson));
