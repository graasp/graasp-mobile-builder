import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import GraaspLogo from '../components/common/GraaspLogo';
import { PRIMARY_COLOR } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';
import type { MainStackNavigatorParamList } from '../navigation/MainStackNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';

export type HomeStackProps = CompositeScreenProps<
  StackScreenProps<HomeStackParamList>,
  CompositeScreenProps<
    StackScreenProps<MainStackNavigatorParamList>,
    StackScreenProps<HomeStackParamList>
  >
>;

export type HomeStackPropsNavigationProp = HomeStackProps['navigation'];
export type HomeStackPropsRouteProp = HomeStackProps['route'];

const HomeScreen: FC<HomeStackProps> = () => {
  const { hooks } = useQueryClient();
  const { data: ownItems, isLoading, refetch } = hooks.useOwnItems();
  const { data: currentMember } = hooks.useCurrentMember();
  useFocusQuery(refetch);
  const { t } = useTranslation();

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

  return (
    <SafeAreaView style={styles.container}>
      <ItemsList
        items={[...(ownItems ?? [])]}
        isLoading={isLoading}
        refresh={refetch}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
