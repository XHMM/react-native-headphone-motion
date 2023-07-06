import React, { useEffect } from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';
import {
  isHeadphoneMotionAvailable,
  requestPermission,
  onDeviceMotionUpdates,
  onDeviceMotionUpdatesError,
  onHeadphoneConnected,
  onHeadphoneDisconnected,
  startListenDeviceMotionUpdates,
  stopDeviceMotionUpdates,
  getAuthorizationStatus,
  isDeviceMotionActive,
  startDeviceMotionUpdates,
  getLatestDeviceMotion,
} from 'react-native-headphone-motion';

export default function App() {
  useEffect(() => {
    console.log('isHeadphoneMotionAvailable:', isHeadphoneMotionAvailable);
    const r = onDeviceMotionUpdates((data) => {
      console.log('onDeviceMotionUpdates:', data);
    });
    const r2 = onDeviceMotionUpdatesError((data) => {
      console.log('onDeviceMotionUpdatesError:', data);
    });
    const r3 = onHeadphoneConnected(() => {
      console.log('onHeadphoneConnected');
    });
    const r4 = onHeadphoneDisconnected(() => {
      console.log('onHeadphoneDisconnected');
    });
    return () => {
      r.remove();
      r2.remove();
      r3.remove();
      r4.remove();
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title={'requestPermission'}
        onPress={async () => {
          const s = await requestPermission();
          console.log('perm:', s);
        }}
      />
      <Button
        title={'startListenDeviceMotionUpdates'}
        onPress={async () => {
          await startListenDeviceMotionUpdates();
          console.log('done');
        }}
      />
      <Button
        title={'stopDeviceMotionUpdates'}
        onPress={async () => {
          await stopDeviceMotionUpdates();
        }}
      />
      <Button
        title={'get status'}
        onPress={async () => {
          const s = await getAuthorizationStatus();
          console.log('status:', s);
        }}
      />
      <Button
        title={'isDeviceMotionActive'}
        onPress={async () => {
          const s = await isDeviceMotionActive();
          console.log('isDeviceMotionActive:', s);
        }}
      />
      <Button
        title={'startDeviceMotionUpdates'}
        onPress={async () => {
          await startDeviceMotionUpdates();
          console.log('startDeviceMotionUpdates');
        }}
      />
      <Button
        title={'getLatestDeviceMotion'}
        onPress={async () => {
          const s = await getLatestDeviceMotion();
          console.log('getLatestDeviceMotion:', s);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
