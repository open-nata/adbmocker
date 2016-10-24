#!/usr/bin/env node

var Mocker  = require('../');

var mocker = new Mocker('080539a400e358f3','/Users/Calvin/Develop/githubs/open-nata/adbmocker/assets/app.apk');

mocker.diagnose().then(function () {
  console.log('end');
});
