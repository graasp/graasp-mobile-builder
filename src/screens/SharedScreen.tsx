import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSharedItems } from '../hooks';
import ItemsList from '../components/ItemsList';
import ActivityIndicator from '../components/ActivityIndicator';
import { useFocusQuery } from '../utils/functions/useQuery';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { SharedStackParamList } from '../navigation/SharedStackNavigator';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';

type SharedStackSharedProps = CompositeScreenProps<
  StackScreenProps<SharedStackParamList, 'SharedStackShared', 'SharedStackNavigator'>,
  StackScreenProps<RootStackParamList>
>;

const SharedScreen: FC<SharedStackSharedProps> = ({ navigation }) => {
  const {
    data: sharedItems,
    isLoading,
    isError,
    refetch,
  } = useSharedItems();
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !sharedItems) {
    throw new Error();
  }

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <ItemsList
        items={[...sharedItems]}
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

export default SharedScreen;
