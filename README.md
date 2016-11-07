Adbmocker
====

# Android permissions list
[en](https://developer.android.com/reference/android/Manifest.permission.html)
[cn](https://www.zybuluo.com/Yano/note/258048)

#  链接
[adb](https://developer.android.com/studio/command-line/adb.html)

# Android 命令
### 导入联系人的步骤
- 清除联系人数据
```
adb shell pm clear com.android.providers.contacts
```
- 将联系人数据导入到手机中
```
adb push contacts.vcf /sdcard/contacts.vcf
```
- 将联系人import到通讯录中
```
adb shell am start -t "text/x-vcard" -d "file:///sdcard/contacts.vcf" -a android.intent.action.VIEW com.android.contacts 
```

### 插入通话记录(如果App监听通话,则可以适时发送这样的intent)
```
adb shell am start -a android.intent.action.CALL tel:8888888888888
```
或用代码:
```
    public void insertCallLog(){
        ContentValues values = new ContentValues();
        values.put(CallLog.Calls.CACHED_NAME, "哈哈先生");
        values.put(CallLog.Calls.NUMBER, "13812344321");
        values.put(CallLog.Calls.DATE, System.currentTimeMillis());
        values.put(CallLog.Calls.DURATION, 0);
        values.put(CallLog.Calls.TYPE,CallLog.Calls.OUTGOING_TYPE);
        values.put(CallLog.Calls.NEW, 1);//0已看1未看
        this.getContentResolver().insert(CallLog.Calls.CONTENT_URI, values);
    }
```

### 列出设备中所有的包名
```
adb shell pm list packages | grep dingding
```

### 备份某个apk
```
adb backup -apk com.alibaba.android.rimet
```

### 解压备份文件
生成的备份文件 [abe](http://download.csdn.net/download/jiangwei0910410003/9523470)
```
java -jar abe.jar unpack backup.ab backup.tar
```
