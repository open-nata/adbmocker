import Device from 'nata-device'
import _ from 'lodash'
import apkparser from 'apkparser'
const apkPath = 'path/to/apk';



import PERMISSIONS from '../permissions'

class AdbMocker{
  constructor(deviceId, apkPath) {
    this._device = new Device(deviceId);
    this._apkPath = apkPath;
  }

  /**
   * check if the specified device has the necessary environment for the apk
   */
  async diagnose() {
    // check
    apkparser.parse(apkPath).then((manifest) => {
      console.log(manifest.permissions)
    });
  }

  static displayPermissions() {
    console.log(PERMISSIONS);
  }

  checkNetWork() {

  }

  mock() {

  }

  mockContacts(num) {

  }

  mockContact() {

  }

}
export default AdbMocker
