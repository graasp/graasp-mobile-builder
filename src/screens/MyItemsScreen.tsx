import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import { useQueryClient } from '../context/QueryClientContext';
import { useFocusQuery } from '../utils/functions/useQuery';

const MyItemsScreen = () => {
  const { hooks } = useQueryClient();
  const { data: ownItems, isLoading, isError, refetch } = hooks.useOwnItems();
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !ownItems) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <ItemsList
        items={[...ownItems]}
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
});

export default MyItemsScreen;
