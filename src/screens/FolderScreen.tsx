import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import { useQueryClient } from '../context/QueryClientContext';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { checkWriteOrAdminItemMembership } from '../utils/functions/itemMembership';
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
  const { hooks } = useQueryClient();
  const {
    data: data1,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = hooks.useItemMemberships(itemId) as any;
  const itemMemberships = data1?.toJS();
  const {
    data: children1,
    isLoading,
    isError,
    refetch,
  } = hooks.useChildren(itemId);
  const children = children1?.toJS() as any;
  const {
    data: currentMember1,
    isLoading: isLoadingCurrentMember,
    isError: isErrorCurrentMember,
  } = hooks.useCurrentMember();
  const currentMember = currentMember1?.toJS();
  useFocusQuery(refetch);

  if (isLoading || isLoadingItemMemberships || isLoadingCurrentMember) {
    return <ActivityIndicator />;
  }

  if (isError || isErrorItemMemberships || isErrorCurrentMember || !children) {
    return null;
  }

  const displayAddItem = checkWriteOrAdminItemMembership(
    itemId,
    currentMember?.id,
    itemMemberships,
  );

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <ItemsList
        parentId={itemId}
        items={[...children]}
        isLoading={isLoading}
        refresh={refetch}
        displayAddItem={displayAddItem}
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

export default FolderScreen;
