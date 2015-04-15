#!/usr/bin/env node
var path = require('path');
var Rsync = require('rsync');
var config = require('./config.deployment.json');
var sourceDir = path.join(__dirname, 'dest');

if (config.destination) {

  var rsync = Rsync.build({
    source:      sourceDir,
    destination: config.destination,
    exclude:     ['.git'],
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
} else {
  console.log('No desitnation found in config file');
}
