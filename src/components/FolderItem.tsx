import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { CompleteMember, DiscriminatedItem } from '@graasp/sdk';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useQueryClient } from '../context/QueryClientContext';
import { ItemScreenProps } from '../navigation/types';
import { checkWriteOrAdminItemMembership } from '../utils/functions/itemMembership';
import { useFocusQuery } from '../utils/functions/useQuery';
import ActivityIndicator from './ActivityIndicator';
import ItemsList from './ItemsList';

type Props = {
  item: DiscriminatedItem;
};

const FolderItem = ({ item }: Props) => {
  const route = useRoute<ItemScreenProps<'ItemStackItem'>['route']>();
  const { itemId, headerTitle } = route.params;

  const { hooks } = useQueryClient();
  const {
    data: itemMemberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = hooks.useItemMemberships(itemId);
  const {
    data: children,
    isLoading,
    isError,
    refetch,
  } = hooks.useChildren(itemId);
  const {
    data: currentMember,
    isLoading: isLoadingCurrentMember,
    isError: isErrorCurrentMember,
  } = hooks.useCurrentMember();
  useFocusQuery(refetch);
  const navigation = useNavigation();

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (!headerTitle) {
      navigation.setOptions({
        title: item?.name,
      });
    }
  }, [navigation, headerTitle]);

  if (isLoading || isLoadingItemMemberships || isLoadingCurrentMember) {
    return <ActivityIndicator />;
  }

  if (isError || isErrorItemMemberships || isErrorCurrentMember || !children) {
    return null;
  }

  const displayAddItem = checkWriteOrAdminItemMembership(
    itemId,
    (currentMember as CompleteMember)?.id,
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
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});

export default FolderItem;
