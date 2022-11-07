import React, { FC, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useOwnItems } from '../hooks';
import ItemsList from '../components/ItemsList';
import ActivityIndicator from '../components/ActivityIndicator';
import { useFocusQuery } from '../utils/functions/useQuery';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../navigation/StackNavigator';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';

type HomeStackProps = CompositeScreenProps<
  StackScreenProps<StackParamList, 'HomeStack', 'StackNavigator'>,
  StackScreenProps<RootStackParamList>
>;

export type HomeStackPropsNavigationProp = HomeStackProps['navigation'];
export type HomeStackPropsRouteProp = HomeStackProps['route'];


const HomeScreen: FC<HomeStackProps> = ({ navigation }) => {
  const { data: ownItems, isLoading, isError, refetch } = useOwnItems();
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !ownItems) {
    throw new Error();
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default HomeScreen;
