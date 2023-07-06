# react-native-headphone-motion
A react-native module for iOS [`CMHeadphoneMotionManager`](https://developer.apple.com/documentation/coremotion/cmheadphonemotionmanager) api, which you can use for getting the headphone(airpods) motion data, this api is only available for iOS 14+

## Install
```shell
npm install react-native-headphone-motion
npx pod-install
```
Then you must add below config to `Info.plist` if you are going to  get headphone motion data, or your app will be crashed by system:
```
<key>NSMotionUsageDescription</key>
<string>The description will be shown under the permission dialog</string>
```

## API

### `isHeadphoneMotionAvailable`
a boolean constant for checking if the system support this functionality

### `requestPermission() => Promise<AuthorizationStatus>`
call this will trigger system permission dialog to request permission and return the permission status.
Same with other permission strategy, the dialog only show at the first call, subsequent calls only return status.

### `getAuthorizationStatus() => Promise<AuthorizationStatus>`
get the permission request status

### `startListenDeviceMotionUpdates() => Promise<void>`
after calling this, `onDeviceMotionUpdates` event will be triggered continuously if the device was connected and `onDeviceMotionUpdatesError` would be triggered if error occurred

### `startDeviceMotionUpdates() => Promise<void>`
after calling this, no `onDeviceMotionUpdates` or `onDeviceMotionUpdatesError` would be triggered, you need to manually call `getLatestDeviceMotion()` to get the latest motion data

### `stopDeviceMotionUpdates() => Promise<void>`
after calling this,  `onHeadphoneDisconnected` event would be triggered (the system automatically disconnect your headphone from your app if you stopped getting motion updates), and `getLatestDeviceMotion()` will always return empty data

### `isDeviceMotionActive() => Promise<boolean>`
check if you are in active status of getting motion data

### `getLatestDeviceMotion() => Promise<HeadphoneMotionData | null>`
get the latest motion data, normally used with `startDeviceMotionUpdates`, return null if you did not call `startXxUpdates`

### `onDeviceMotionUpdates((data: HeadphoneMotionData) => void) => EmitterSubscription`
a listener called after you called `startListenDeviceMotionUpdates`

### `onDeviceMotionUpdatesError((error: {text: string}) => void) => EmitterSubscription`
a listener called after you called `startListenDeviceMotionUpdates`

### `onHeadphoneConnected(() => void) => EmitterSubscription`
a listener called when you called `startXxUpdates` and headphone is in connected

### `onHeadphoneDisconnected(() => void) => EmitterSubscription`
a listener called when you called `stopDeviceMotionUpdates` and headphone is in connected

## License

MIT
