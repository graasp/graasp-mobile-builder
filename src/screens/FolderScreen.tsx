import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import PlayerView from '../components/PlayerView';
import { useView } from '../context/ViewContext';
import { useChildren } from '../hooks';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';

type CommonStackFolderProps = CompositeScreenProps<
  StackScreenProps<
    CommonStackParamList,
    'CommonStackFolder',
    'CommonStackNavigator'
  >,
  StackScreenProps<RootStackParamList>
>;
type FolderScreenRouteProp = CommonStackFolderProps['route'];

const FolderScreen: FC<CommonStackFolderProps> = ({ navigation }) => {
  const route = useRoute<FolderScreenRouteProp>();
  const { itemId, headerTitle } = route.params;

  const { data: children, isLoading, isError, refetch } = useChildren(itemId);
  useFocusQuery(refetch);
  const { isPlayerView } = useView();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !children) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      {isPlayerView ? (
        <PlayerView children={children} />
      ) : (
        <ItemsList
          parentId={itemId}
          items={[...children]}
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

export default FolderScreen;
