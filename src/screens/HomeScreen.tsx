import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, Image, Input, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCodeScanner } from 'react-native-vision-camera';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import logo from '../assets/adaptive-icon.png';
import ActivityIndicator from '../components/ActivityIndicator';
import GraaspLogo from '../components/common/GraaspLogo';
import { PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';
import type { MainStackNavigatorParamList } from '../navigation/MainStackNavigator';
import { VisionCamera, useVisionCameraDevice } from '../nocks/vision-camera';
import { useFocusQuery } from '../utils/functions/useQuery';

export type HomeStackProps = CompositeScreenProps<
  StackScreenProps<HomeStackParamList>,
  CompositeScreenProps<
    StackScreenProps<MainStackNavigatorParamList>,
    StackScreenProps<HomeStackParamList>
  >
>;

// export type HomeStackPropsNavigationProp = NavigationProp<HomeStackProps>;
export type HomeStackPropsRouteProp = HomeStackProps['route'];

const HomeScreen: FC<HomeStackProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const device = useVisionCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`);
    },
  });
  const { hooks } = useQueryClient();
  const { data: ownItems, isLoading, refetch } = hooks.useOwnItems();
  const { data: currentMember } = hooks.useCurrentMember();
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!currentMember) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={['left']}>
        <GraaspLogo color={PRIMARY_COLOR} />
        <Text h2>{t('Welcome!')}</Text>
        <Text>{t('You are not signed in.')}</Text>
      </SafeAreaView>
    );
  }

  if (device == null) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <Image
        resizeMode="contain"
        style={{ width: 200, height: 200 }}
        source={logo}
      />
      <Button
        title="Scan QR Code"
        // buttonStyle={{ backgroundColor: '#b5b5b5' }}
        // onPress={() => setCreateItemModalVisible({ toggle: false })}
      />

      <VisionCamera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />

      <Text>or enter short URL below</Text>
      <Input
        // label={t('url')}
        placeholder={t('url')!}
        // onChangeText={(value) => setItemName(value)}
        // value={itemName}
        underlineColorAndroid={'black'}
        labelStyle={{
          color: 'black',
          fontWeight: '700',
        }}
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#cccccc"
      />
      <Button
        title="Submit"
        // buttonStyle={{ backgroundColor: '#b5b5b5' }}
        // onPress={() => setCreateItemModalVisible({ toggle: false })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
