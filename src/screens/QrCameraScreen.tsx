import { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera/next';

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
        const { status } = await Camera.requestCameraPermissionsAsync();
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

    const itemId = getItemIdFromUrl(data);
    if (itemId) {
      navigate(ITEM_NAVIGATOR, {
        screen: ITEM_NAVIGATOR_ITEM,
        params: {
          itemId,
        },
      });
    }
  };
  return (
    <View style={styles.cameraContainer}>
      <GraaspBarCodeScanner
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={onBarCodeScanned}
        style={styles.camera}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            goBack();
          }}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
      </GraaspBarCodeScanner>
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
    marginTop: 40,
    marginLeft: 15,
    padding: 10,
    borderRadius: 50,
    width: 45,
    backgroundColor: PRIMARY_COLOR,
  },
});

export default QrCameraScreen;
