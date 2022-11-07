import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { useChildren } from '../hooks';
import { useFocusQuery } from '../utils/functions/useQuery';
import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';

type CommonStackFolderProps = CompositeScreenProps<
  StackScreenProps<CommonStackParamList, 'CommonStackFolder', 'CommonStackNavigator'>,
  StackScreenProps<RootStackParamList>
>;
type FolderScreenRouteProp = CommonStackFolderProps['route'];

const FolderScreen: FC<CommonStackFolderProps> = ({ navigation }) => {
  let route = useRoute<FolderScreenRouteProp>();
  let { itemId, headerTitle } = route.params;
  
  const { data: children, isLoading, isError, refetch } = useChildren(itemId);
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !children) {
    throw new Error();
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <ItemsList
        items={[...children]}
        isLoading={isLoading}
        refresh={refetch}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default FolderScreen;
