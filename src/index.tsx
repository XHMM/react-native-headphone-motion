import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-headphone-motion' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: '- You have run \'pod install\'\n', default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const HeadphoneMotionModule = NativeModules.HeadphoneMotionModule
  ? NativeModules.HeadphoneMotionModule
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    },
  );

const eventEmitter = new NativeEventEmitter(HeadphoneMotionModule);

export let isHeadphoneMotionAvailable = false;
try {
  isHeadphoneMotionAvailable =
    HeadphoneMotionModule.getConstants()?.isHeadphoneMotionAvailable ?? false;
} catch {
}

export type MotionXYZ = { x: number; y: number; z: number };

export interface HeadphoneMotionData {
  attitude: { roll: number; rollDeg: number; pitch: number; pitchDeg: number; yaw: number; yawDeg: number };
  rotationRate: MotionXYZ;
  userAcceleration: MotionXYZ;
  gravity: MotionXYZ;
}

export enum AuthorizationStatus {
  /**
   * The status has not yet been determined.
   */
  notDetermined = 0,
  /**
   * Access is denied due to system-wide restrictions.
   */
  restricted,
  /**
   * Access was denied by the user.
   */
  denied,
  /**
   * Access was granted by the user.
   */
  authorized,
}

export async function getAuthorizationStatus(): Promise<AuthorizationStatus> {
  return await HeadphoneMotionModule.getAuthorizationStatus();
}

export async function requestPermission(): Promise<AuthorizationStatus> {
  const status = await getAuthorizationStatus();
  if (status === AuthorizationStatus.notDetermined) {
    await HeadphoneMotionModule.startDeviceMotionUpdates();
  }
  return await getAuthorizationStatus();
}

export async function startListenDeviceMotionUpdates() {
  await HeadphoneMotionModule.startListenDeviceMotionUpdates();
}

export async function startDeviceMotionUpdates() {
  await HeadphoneMotionModule.startDeviceMotionUpdates();
}

export async function stopDeviceMotionUpdates() {
  await HeadphoneMotionModule.stopDeviceMotionUpdates();
}

export async function isDeviceMotionActive(): Promise<boolean> {
  return await HeadphoneMotionModule.isDeviceMotionActive();
}

export async function getLatestDeviceMotion(): Promise<HeadphoneMotionData | null> {
  return await HeadphoneMotionModule.getLatestDeviceMotion();
}

export function onDeviceMotionUpdatesError(
  cb: (data: { text: string }) => void,
) {
  return eventEmitter.addListener('onDeviceMotionUpdatesError', cb);
}

export function onDeviceMotionUpdates(cb: (data: HeadphoneMotionData) => void) {
  return eventEmitter.addListener('onDeviceMotionUpdates', cb);
}

export function onHeadphoneConnected(cb: () => void) {
  return eventEmitter.addListener('onHeadphoneConnected', cb);
}

export function onHeadphoneDisconnected(cb: () => void) {
  return eventEmitter.addListener('onHeadphoneDisconnected', cb);
}
