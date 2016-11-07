#!/usr/bin/env node

var Mocker  = require('../');

var mocker = new Mocker('080539a400e358f3','/Users/Calvin/Develop/githubs/open-nata/adbmocker/assets/ZHNT.apk');

// mocker.mockContacts().then(() => console.log('导入通讯录成功')).catch((err) => console.log('导入通讯录失败'));
// mocker.mockCalls().then(() => console.log('导入通话记录成功')).catch((err) => console.log('导入通话记录失败'));
mocker.mockPhotos().then(() => console.log('导入图片成功')).catch((err) => console.log('导入图片失败'));
//
// mocker.diagnose().then(function () {
//   console.log('end');
// });
