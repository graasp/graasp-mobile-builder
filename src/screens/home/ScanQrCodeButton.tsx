import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, CameraType } from 'expo-camera';

import { useIsFocused } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../../config/constants/constants';
import { defaultScreenOptions } from '../../config/constants/navigation';
import { MainStackNavigationProp } from '../../navigation/MainStackNavigator';

const ScanQrCodeButton = () => {
  const { t } = useTranslation();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { navigate } = useNavigation<MainStackNavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  //   if (!permission) ...

  //   if (!permission.granted) ...

  // 2. Only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();
  // const isForeground = useIsForeground();

  const onPress = () => {
    console.log('open camera');
    setIsCameraOpen(true);
    setScanned(true);

    navigate('QrCamera');
  };
  const screenOptions = { headerShown: false, ...defaultScreenOptions };

  return (
    <Button
      buttonStyle={styles.button}
      icon={
        <MaterialIcons
          style={{ marginRight: 7 }}
          name={'qr-code'}
          color="#ffffff"
          size={25}
        />
      }
      title="Scan QR Code"
      onPress={onPress}
    />
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
    textAlign: 'center',
  },
  addItemButton: {
    position: 'absolute',
    flex: 1,
    zIndex: 9999,
    top: 0,
  },
});

export default ScanQrCodeButton;
