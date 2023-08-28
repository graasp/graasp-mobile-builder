import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemsList from '../components/ItemsList';
import PlayerView from '../components/PlayerView';
import { addItemPermissions } from '../config/constants/constants';
import { useView } from '../context/ViewContext';
import { useChildren, useItemMemberships } from '../hooks';
import { useCurrentMember } from '../hooks/member';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ItemMembership } from '../types';
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
  const { isPlayerView } = useView();

  if (isLoading || isLoadingItemMemberships || isLoadingCurrentMember) {
    return <ActivityIndicator />;
  }

  if (isError || isErrorItemMemberships || isErrorCurrentMember || !children) {
    return null;
  }

  let displayAddItem = false;

  if (itemMemberships?.data[itemId]) {
    itemMemberships.data[itemId].map((itemMembership: ItemMembership) => {
      if (
        itemMembership.member.id === currentMember?.id &&
        addItemPermissions.includes(itemMembership.permission)
      ) {
        displayAddItem = true;
      }
    });
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
          displayAddItem={displayAddItem}
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
