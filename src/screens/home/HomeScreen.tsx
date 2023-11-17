import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import GraaspLogo from '../../components/common/GraaspLogo';
import { PRIMARY_COLOR } from '../../config/constants/constants';
import type { HomeStackParamList } from '../../navigation/HomeStackNavigator';
import type { MainStackNavigatorParamList } from '../../navigation/MainStackNavigator';
import ScanQrCodeButton from './ScanQrCodeButton';
import ShortUrlInput from './ShortUrlInput';

export type HomeStackProps = CompositeScreenProps<
  StackScreenProps<HomeStackParamList>,
  CompositeScreenProps<
    StackScreenProps<MainStackNavigatorParamList>,
    StackScreenProps<HomeStackParamList>
  >
>;

// export type HomeStackPropsNavigationProp = NavigationProp<HomeStackProps>;
export type HomeStackPropsRouteProp = HomeStackProps['route'];

const HomeScreen: FC<HomeStackProps> = () => {
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
    paddingTop: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
