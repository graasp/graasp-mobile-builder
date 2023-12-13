import React from 'react';
import { Text } from 'react-native-elements';
import { LaunchArguments } from 'react-native-launch-arguments';

import { LaunchArgs } from './types';

console.log('[DETOX] Using mocked BarCodeScanner');

export class GraaspBarCodeScanner extends React.PureComponent<{
  onBarCodeScanned: (args: { type: string; data: string }) => void;
}> {
  render() {
    const { cameraItemUrl } = LaunchArguments.value<LaunchArgs>();
    const type = 'qr';
    // opens test defined url, development defined url or default string
    const data =
      cameraItemUrl ?? process.env.EXPO_PUBLIC_CAMERA_ITEM_URL ?? 'camera-url';
    this.props.onBarCodeScanned({ type, data });
    return <Text>Mocked BarCodeScanner</Text>;
  }
}
