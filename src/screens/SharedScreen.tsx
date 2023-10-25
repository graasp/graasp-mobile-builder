import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import { useQueryClient } from '../context/QueryClientContext';
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
  const { hooks } = useQueryClient();
  const {
    data: sharedItems1,
    isLoading,
    isError,
    refetch,
  } = hooks.useSharedItems();
  const sharedItems = sharedItems1?.toJS();
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !sharedItems) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <ItemsList
        items={[...sharedItems]}
        isLoading={isLoading}
        refresh={refetch}
        displayAddItem={false}
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
});

export default SharedScreen;
