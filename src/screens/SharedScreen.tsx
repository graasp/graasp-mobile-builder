import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import PlayerView from '../components/PlayerView';
import { useView } from '../context/ViewContext';
import { useSharedItems } from '../hooks';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SharedStackParamList } from '../navigation/SharedStackNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';

type SharedStackSharedProps = CompositeScreenProps<
  StackScreenProps<
    SharedStackParamList,
    'SharedStackShared',
    'SharedStackNavigator'
  >,
  StackScreenProps<RootStackParamList>
>;

const SharedScreen: FC<SharedStackSharedProps> = ({ navigation }) => {
  const { data: sharedItems, isLoading, isError, refetch } = useSharedItems();
  const { isPlayerView } = useView();
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !sharedItems) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      {isPlayerView ? (
        <PlayerView children={sharedItems} />
      ) : (
        <ItemsList
          items={[...sharedItems]}
          isLoading={isLoading}
          refresh={refetch}
          isSharedScreen={true}
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

export default SharedScreen;
