#!/usr/bin/env node

var Mocker  = require('../');
var path = require('path');
var deviceId = '080539a400e358f3';
var apkPath = path.join(__dirname,'../assets/ZHNT.apk');

var mocker = new Mocker(deviceId, apkPath);

// mocker.mockContacts().then(() => console.log('导入通讯录成功')).catch((err) => console.log('导入通讯录失败'));
// mocker.mockCalls().then(() => console.log('导入通话记录成功')).catch((err) => console.log('导入通话记录失败'));
// mocker.mockPhotos().then(() => console.log('导入图片成功')).catch((err) => console.log('导入图片失败'));
mocker.mockVideos().then(() => console.log('导入视频成功')).catch((err) => console.log('导入视频失败'));
// mocker.mockMusics().then(() => console.log('导入音乐成功')).catch((err) => console.log('导入音乐失败'));
//
// mocker.diagnose().then(function () {
//   console.log('end');
// });
