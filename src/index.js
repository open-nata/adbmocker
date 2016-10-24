import Device from 'nata-device'
import apkparser from 'apkparser'
import PERMISSIONS from '../permissions'
import chalk from 'chalk'
import _ from 'lodash'

const info = chalk.blue;
const warn = chalk.yellow;

class AdbMocker{
  constructor(deviceId, apkPath) {
    this._device = new Device(deviceId);
    this._apkPath = apkPath;
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
    console.log('正在根据权限mock数据...')

  }

  /**
   * 根据权限检测设备环境
   * @param permissions
   */
  check(permissions) {
    permissions.forEach(permission => {
      switch(permission) {
        // 检测网络
        case 'android.permission.INTERNET': this.checkNetWork(); break;

      }
    });
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
   * 检测网络状况
   */
  checkNetWork() {
    console.log('应用申请了网络相关权限,正在检查设备网络情况...');
    // this._device.

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
   * @param num
   */
  mockContacts(num = 10) {

  }

  /**
   * mock 通话记录
   * @param num
   */
  mockCalls(num = 10) {

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
  mockSMS(num = 10) {

  }

  /** mock音乐文件
   * 应用的类型包括MUSIC
   */
  mockMusics(num = 10) {

  }

  /**
   * mock视频文件
   * 应用类型包括Videoe
   * @param num
   */
  mockVideos(num = 3) {

  }

  /**
   * 将任何类型的文件push到设备的SD卡中
   * @param filePath
   */
  pushFiles(filePath) {

  }
}
export default AdbMocker
