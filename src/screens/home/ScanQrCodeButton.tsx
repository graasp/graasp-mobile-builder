import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useIsFocused, useNavigation } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../../config/constants/constants';
import { MainStackScreenProps } from '../../navigation/types';

const ScanQrCodeButton = (): JSX.Element | null => {
  const { t } = useTranslation();

  const [permission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);
  const { navigate } =
    useNavigation<MainStackScreenProps<'QrCamera'>['navigation']>();

  // only activate Camera when the app is focused and this screen is currently opened
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      if (isFocused) {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, [isFocused]);

  const disabled = !permission || !permission.granted || !hasPermission;

  const onPress = () => {
    console.debug('open camera');
    navigate('QrCamera');
  };

  return (
    <>
      <Button
        disabled={disabled}
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
      {disabled && (
        <Text style={styles.permissionInfo}>
          {t(
            'You need to grant permission to the camera to use the QR scanner feature',
          )}
        </Text>
      )}
    </>
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
  permissionInfo: {
    paddingBottom: 10,
  },
});

export default ScanQrCodeButton;
