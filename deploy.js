#!/usr/bin/env node
var path = require('path');
var Rsync = require('rsync');
var config = require('./config.deployment.json');
var sourceDir = path.join(__dirname, 'dest');

var environment = process.argv[2];

if (!environment) {
  console.log('No deployment environment selected.');
  console.log('  Available options "staging", "live"');
  console.log('  Example: ./deploy.js staging');
  return;
}

if (!config[environment]) {
  console.log('No deployment configuration found for "' + environment + '"');
  return;
}

config = config[environment];

if (!config.destination) {
  console.log('No deployment desitnation found for environment "' + environment + '"');
  return;
}


var rsync = Rsync.build({
  source:      sourceDir,
  destination: config.destination,
  exclude:     ['.git', '*.js.map', '*.css.map'],
  flags:       'avz',
  shell:       'ssh'
});

rsync.execute(function(error, stdout, stderr) {
  if (error) {
    console.log('Error:');
    console.log(error, stderr);
  } else {
    console.log('Deployment successful!');
  }
});
