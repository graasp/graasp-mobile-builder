import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';

import { useIsFocused } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../config/constants/constants';
import { GraaspBarCodeScanner } from '../mocks/camera';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_ITEM,
  MAIN_NAVIGATOR_MAIN,
} from '../navigation/names';
import { MainStackScreenProps } from '../navigation/types';
import { getItemIdFromUrl } from '../utils/functions/url';

export const QrCameraScreen = ({
  navigation: { goBack, navigate },
}: MainStackScreenProps<'QrCamera'>) => {
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
    // push intermediate state for go back to work
    // todo: fix type
    // @ts-ignore
    navigate(MAIN_NAVIGATOR_MAIN);

    // todo: host manager
    const itemId = getItemIdFromUrl(data);
    if (itemId) {
      navigate(ITEM_NAVIGATOR, {
        screen: ITEM_NAVIGATOR_ITEM,
        params: {
          itemId,
        },
      });
    }

    // todo: get value and navigate
  };
  return (
    <View style={styles.cameraContainer}>
      <GraaspBarCodeScanner
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.QR]}
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
