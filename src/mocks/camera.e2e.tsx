import React from 'react';
import { Text } from 'react-native-elements';

console.log('[DETOX] Using mocked BarCodeScanner');

export class GraaspBarCodeScanner extends React.PureComponent<{
  onBarCodeScanned: (args: { type: string; data: string }) => void;
}> {
  render() {
    const type = 'qr';
    const data =
      'https://library.dev.graasp.org/collections/bcbf59a7-6871-4217-9045-6bf0270ba4a6';
    this.props.onBarCodeScanned({ type, data });
    return <Text>Mocked BarCodeScanner</Text>;
  }
}
