import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompleteMember, DiscriminatedItem } from '@graasp/sdk';

import { useNavigation, useRoute } from '@react-navigation/native';

import { useQueryClient } from '../context/QueryClientContext';
import { ItemScreenProps } from '../navigation/types';
import { checkWriteOrAdminItemMembership } from '../utils/functions/itemMembership';
import { useFocusQuery } from '../utils/functions/useQuery';
import ActivityIndicator from './ActivityIndicator';
import ItemsList from './ItemsList';
import PlayerButton from './common/PlayerButton';

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

  useEffect(() => {
    if (item) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <PlayerButton
              itemId={itemId}
              name={item.name}
              type={item.type}
              color="white"
            />
          </View>
        ),
      });
    }
  }, [navigation, item]);

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
  headerButtons: {
    paddingRight: 10,
  },
});

export default FolderItem;
