import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import { useQueryClient } from '../context/QueryClientContext';
import { useFocusQuery } from '../utils/functions/useQuery';

const SharedScreen = () => {
  const { hooks } = useQueryClient();
  const {
    data: sharedItems,
    isLoading,
    isError,
    refetch,
  } = hooks.useSharedItems();
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
