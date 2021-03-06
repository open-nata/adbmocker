import Device from 'nata-device'
import apkparser from 'apkparser'
import PERMISSIONS from '../permissions'
import chalk from 'chalk'
import _ from 'lodash'
import Types from './Types'
import path from 'path'

const info = chalk.blue;
const warn = chalk.yellow;

class AdbMocker{
  constructor(deviceId, apkPath, types) {
    this._device = new Device(deviceId);
    this._apkPath = apkPath;
    this._types = this.setType(types);
  }

  /**
   * check if the specified device has the necessary environment for the apk
   */
  async diagnose() {
    // parse apk
    console.log('正在分析Apk...');
    const manifest = await apkparser.parse(this._apkPath);

    console.log('Apk 信息如下:');
    console.log(info(manifest.permissions));
    console.log(info(manifest.activities));
    console.log(info(manifest.receivers));
    console.log(info(manifest.packageName));
    console.log(info(manifest.entry));

    console.log('目前应用申请的权限列表如下: ');
    const pInfo = this.displayPermissions(manifest.permissions);
    pInfo.forEach(permission => console.log(info(permission)));

    console.log('正在安装apk...');
    await this._device.install(this._apkPath);
    console.log('安装完成!');

    console.log('正在分析目前应用已获得的权限: ');
    const gPermissions = await this._device.getGrantedPermissions(manifest.packageName);
    gPermissions.forEach(permission => console.log(info(permission)));

    console.log('应用缺乏权限,请注意赋权限: ');
    const ngPermissions = _.difference(manifest.permissions, gPermissions);
    ngPermissions.forEach(permission => console.log(warn(`${permission}: ${PERMISSIONS[permission]}`)));

    console.log('正在根据已赋权限检测设备环境...');
    this.check(gPermissions);

    console.log('正在根据已赋权限mock数据...');
    this.mock(gPermissions);

    console.log('正在根据配置的类型mock数据');
    this.push(this._types);
  }

  setType(types) {
    this._types = types;
  }

  /**
   * 根据应用类型push数据到设备中
   * @param types
   */
  push(types) {
    types.forEach(type => {
      switch(type) {
        // 音乐编辑,播放类型
        case Types.MUSIC: this.mockMusics(); break;
        // 视频播放,编辑等类型
        case Types.VIDEO: this.mockVideos(); break;
        // 图片处理,显示等类型
        case Types.PHOTO: this.mockPhotos(); break;
      }
    });
  }

  /**
   * 根据权限检测设备环境
   * @param permissions
   */
  async check(permissions) {
    for(let i = 0 ; i< permissions.length ; i++) {
      let permission = permissions[i];
      switch(permission) {
        // 检测网络是否畅通
        case 'android.permission.INTERNET': await this.checkNetWork(); break;
        // 检查蓝牙是否打开
        case 'android.permission.BLUETOOTH': await this.checkBluetooth();break;
      }
    }
  }

  /**
   * 展示权限的相关信息
   * @param permissions
   * @returns {Array}
   */
  displayPermissions(permissions) {
    return permissions.map(permission => {
      let explanation = PERMISSIONS[permission];
      return `${permission} : ${explanation}`;
    });
  }

  /**
   * 检测网络状况 with ping
   */
  async checkNetWork() {
    console.log('应用申请了网络相关权限,正在检查设备网络情况...');
    const output = await this._device.adbshell('ping -c 4 www.baidu.com');
    const connect = /4 received/.test(output);
    if (connect) {
      console.log('网络连接良好');
    } else {
      console.log('无法连接网络或网络连接太差,请检查网络');
    }
  }

  /**
   * 检查蓝牙是否打开
   */
  checkBluetooth() {
    console.log('应用申请了蓝牙相关权限,正在检查蓝牙是否打开...');
  }

  /**
   * 总mock方法
   * @param permissions
   */
  mock(permissions) {
    permissions.forEach(permission => {
      switch(permission) {
        // 读取联系人
        case 'android.permission.READ_CONTACTS': this.mockContacts(); break;
        // 读取通话记录
        case 'android.permission.READ_CALL_LOG': this.mockCalls(); break;
        // 读取用户日历数据
        case 'android.permission.READ_CALENDAR': this.mockCalendar();break;
        // 读取个人信息
        case 'android.permission.READ_PROFILE': this.mockProfile();break;
        // 读取短信
        case 'android.permission.READ_SMS': this.mockSMS();break;
      }
    });
  }

  /**
   * mock联系人
   */
  async mockContacts() {
     await this._device.adbshell('pm clear com.android.providers.contacts');
     await Device.shell(`adb push ${path.join(__dirname, "/../assets/contacts.vcf")} /sdcard/contacts.vcf`);
     await this._device.adbshell('am start -t "text/x-vcard" -d "file:///sdcard/contacts.vcf" -a android.intent.action.VIEW com.android.contacts');
  }

  /**
   * mock 通话记录, 只能mock打电话
   */
  async mockCalls() {
    for(let i = 0; i < 20; i++) {
      let number = Math.floor(Math.random()*1000000000+1);
      await this._device.adbshell(`am start -a android.intent.action.CALL tel:${number}`);
      await this._device.sleep(1000);
    }
  }

  /**
   * mock 日历数据
   * @param num
   */
  mockCalendar(num = 10) {

  }

  /**
   * mock用户个人数据
   */
  mockProfile() {

  }

  /**
   * mock短信消息
   * @param num
   */
  mockSMS() {

  }

  /** mock音乐文件
   * 应用的类型包括MUSIC
   */
  async mockMusics() {
    await Device.shell(`adb push ${path.join(__dirname, "/../assets/musics/")} /sdcard/musics/`);
  }

  /**
   * mock视频文件
   * @param num
   */
  async mockVideos() {
    await Device.shell(`adb push ${path.join(__dirname, "/../assets/videos/")} /sdcard/videos/`);
  }

  /**
   * mock照片文件
   * 应用类型包括Photos
   * @param num
   */
  async mockPhotos() {
    await Device.shell(`adb push ${path.join(__dirname, "/../assets/photos/")} /sdcard/photos/`);
  }

  /**
   * 将任何类型的文件push到设备的SD卡中
   * @param filePath
   */
  async pushFile(filePath) {
    await Device.shell(`adb push ${filePath} /sdcard/others/`);
  }
}
export default AdbMocker
