import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { PRIMARY_COLOR } from '../config/constants/constants';
import { GraaspBarCodeScanner } from '../mocks/camera';
import {
  MainStackNavigationProp,
  MainStackNavigatorParamList,
} from '../navigation/MainStackNavigator';

type StackItemProps = StackScreenProps<MainStackNavigatorParamList>;

export type CameraViewNavigationProp = StackItemProps['navigation'];

export const QrCameraScreen = () => {
  const { goBack } = useNavigation<MainStackNavigationProp>();

  // only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      // double check on the permission, go back if does not have permission
      if (isFocused) {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status !== 'granted') {
          goBack();
        }
      }
    })();
  }, [isFocused]);

  const onBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (type === 'qr') {
      // todo: host manager
      if (data.includes('graasp.org')) {
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        // navigate('CommonStackItem', {
        //   itemId: '553d9d89-523e-4cb3-a16d-0b3498465568',
        // });
      }
    }
    // todo: get value and navigate
  };
  return (
    <View style={styles.cameraContainer}>
      <GraaspBarCodeScanner
        onBarCodeScanned={onBarCodeScanned}
        style={styles.camera}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    width: '100%',
    aspectRatio: 0.5, // todo: aspect ratio full height of the device
    overflow: 'hidden',
    zIndex: 998,
    position: 'absolute',
    top: 0,
  },
  camera: {
    flex: 1,
  },
  button: {
    marginVertical: 20,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
    width: '100%',
  },
  addItemButton: {
    position: 'absolute',
    flex: 1,
    zIndex: 9999,
    top: 0,
  },
});

export default QrCameraScreen;
