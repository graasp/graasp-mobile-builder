import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import GraaspLogo from '../../components/common/GraaspLogo';
import { PRIMARY_COLOR } from '../../config/constants/constants';
import ScanQrCodeButton from './ScanQrCodeButton';
import ShortUrlInput from './ShortUrlInput';

const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <GraaspLogo color={PRIMARY_COLOR} height={200} width={200} />
      <ScanQrCodeButton />

      <Text>{t('or enter short URL below')}</Text>
      <ShortUrlInput />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
