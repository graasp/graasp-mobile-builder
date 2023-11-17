import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useIsFocused } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../../config/constants/constants';
import { MainStackNavigationProp } from '../../navigation/MainStackNavigator';

const ScanQrCodeButton = (): JSX.Element | null => {
  const { t } = useTranslation();

  const [permission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const { navigate, goBack } = useNavigation<MainStackNavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      goBack();
    }
  }, [isFocused]);

  if (!permission || !permission.granted || !hasPermission) {
    return null;
  }

  const onPress = () => {
    console.log('open camera');

    navigate('QrCamera');
  };

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
      title={t('Scan QR Code')}
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
