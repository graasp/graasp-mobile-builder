import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';

import { useNavigation } from '@react-navigation/native';

import { SCAN_QR_CODE_BUTTON } from '../../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../../config/constants/constants';
import { MAIN_NAVIGATOR_QR_CAMERA } from '../../navigation/names';
import { MainStackScreenProps } from '../../navigation/types';

const ScanQrCodeButton = (): JSX.Element | null => {
  const { t } = useTranslation();

  const [permission] = Camera.useCameraPermissions();
  const { navigate } =
    useNavigation<MainStackScreenProps<'QrCamera'>['navigation']>();

  const checkPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    return status === 'granted';
  };

  const onPress = () => {
    console.debug('open camera');
    const hasPermission = permission?.status === 'granted';
    if (hasPermission) {
      navigate(MAIN_NAVIGATOR_QR_CAMERA);
    } else {
      checkPermissions().then((isGranted) => {
        if (isGranted) {
          navigate(MAIN_NAVIGATOR_QR_CAMERA);
        }
      });
    }
  };

  return (
    <Button
      buttonStyle={styles.button}
      icon={
        <MaterialIcons
          style={{ marginRight: 7 }}
          name="qr-code"
          color="#ffffff"
          size={25}
        />
      }
      title={t('Scan QR Code')}
      onPress={onPress}
      testID={SCAN_QR_CODE_BUTTON}
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
