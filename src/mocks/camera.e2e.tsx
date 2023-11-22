import React from 'react';
import { Text } from 'react-native-elements';

console.log('[DETOX] Using mocked BarCodeScanner');

export class GraaspBarCodeScanner extends React.PureComponent<{
  onBarCodeScanned: (args: { type: string; data: string }) => void;
}> {
  render() {
    const type = 'qr';
    const data =
      'https://builder.stage.graasp.org/items/553d9d89-523e-4cb3-a16d-0b3498465568';
    this.props.onBarCodeScanned({ type, data });
    return <Text>Mocked BarCodeScanner</Text>;
  }
}
