import React from 'react';
import { Text } from 'react-native-elements';

console.log('[DETOX] Using mocked BarCodeScanner');

export class GraaspBarCodeScanner extends React.PureComponent<{
  onBarCodeScanned: (args: { type: string; data: string }) => void;
}> {
  render() {
    const type = 'qr';
    const data =
      'https://library.stage.graasp.org/collections/9214ad4e-48ca-4aa5-9a9c-c9bfd4cb19d3';
    this.props.onBarCodeScanned({ type, data });
    return <Text>Mocked BarCodeScanner</Text>;
  }
}
