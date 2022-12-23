import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import PlayerView from '../components/PlayerView';
import { useView } from '../context/ViewContext';
import { useOwnItems } from '../hooks';
import { RootStackParamList } from '../navigation/RootNavigator';
import { StackParamList } from '../navigation/StackNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';

type HomeStackProps = CompositeScreenProps<
  StackScreenProps<StackParamList, 'HomeStack', 'StackNavigator'>,
  StackScreenProps<RootStackParamList>
>;

export type HomeStackPropsNavigationProp = HomeStackProps['navigation'];
export type HomeStackPropsRouteProp = HomeStackProps['route'];

const HomeScreen: FC<HomeStackProps> = ({ navigation }) => {
  const { data: ownItems, isLoading, isError, refetch } = useOwnItems();
  const { isPlayerView } = useView();
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !ownItems) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      {isPlayerView ? (
        <PlayerView children={ownItems} />
      ) : (
        <ItemsList
          items={[...ownItems]}
          isLoading={isLoading}
          refresh={refetch}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default HomeScreen;
