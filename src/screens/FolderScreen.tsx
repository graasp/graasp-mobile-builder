import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import { useChildren, useItemMemberships } from '../hooks';
import { useCurrentMember } from '../hooks/member';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';
import { checkWriteOrAdminItemMembership } from '../utils/functions/itemMembership';

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
  const {
    data: itemMemberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = useItemMemberships(itemId);
  const { data: children, isLoading, isError, refetch } = useChildren(itemId);
  const {
    data: currentMember,
    isLoading: isLoadingCurrentMember,
    isError: isErrorCurrentMember,
  } = useCurrentMember();
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
