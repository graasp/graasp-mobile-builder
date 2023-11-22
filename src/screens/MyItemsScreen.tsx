import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import { useQueryClient } from '../context/QueryClientContext';
import { MyItemsStackParamList } from '../navigation/MyItemsStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';

type MyItemsStackProps = CompositeScreenProps<
  StackScreenProps<MyItemsStackParamList, 'MyItemsStack', 'StackNavigator'>,
  StackScreenProps<RootStackParamList>
>;

export type MyItemsStackPropsNavigationProp = MyItemsStackProps['navigation'];
export type MyItemsStackPropsRouteProp = MyItemsStackProps['route'];

const MyItemsScreen: FC<MyItemsStackProps> = ({ navigation }) => {
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
