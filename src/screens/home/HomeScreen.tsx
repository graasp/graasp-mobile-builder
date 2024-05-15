import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import GraaspLogo from '../../components/common/GraaspLogo';
import { PRIMARY_COLOR } from '../../config/constants/constants';
import ScanQrCodeButton from './ScanQrCodeButton';
import ShortUrlInput from './ShortUrlInput';

const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.area} edges={['left']}>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.container}>
          <GraaspLogo color={PRIMARY_COLOR} height={200} width={200} />
          <ScanQrCodeButton />

          <Text>{t('GO_TO_LINK_TEXT')}</Text>
          <ShortUrlInput />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
