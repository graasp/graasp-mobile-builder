import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompleteMember, Context, DiscriminatedItem } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { CHAT_BUTTON_HEADER } from '../../e2e/constants/testIds';
import { useQueryClient } from '../context/QueryClientContext';
import { ItemScreenProps } from '../navigation/types';
import { handleOpenChat } from '../utils/functions/chat';
import { checkWriteOrAdminItemMembership } from '../utils/functions/itemMembership';
import { useFocusQuery } from '../utils/functions/useQuery';
import ActivityIndicator from './ActivityIndicator';
import ItemsList from './ItemsList';
import FileHeaderButton from './common/FileHederButton';
import PlayerButton from './common/PlayerButton';

type Props = {
  item: DiscriminatedItem;
};

const FolderItem = ({ item }: Props) => {
  const { hooks } = useQueryClient();
  const {
    data: itemMemberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = hooks.useItemMemberships(item.id);
  const {
    data: children,
    isLoading,
    isError,
    refetch,
  } = hooks.useChildren(item.id);
  const {
    data: currentMember,
    isLoading: isLoadingCurrentMember,
    isError: isErrorCurrentMember,
  } = hooks.useCurrentMember();
  useFocusQuery(refetch);
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  useEffect(() => {
    if (item) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <FileHeaderButton
              name="chat"
              handler={() => handleOpenChat(navigation, item)}
              testID={CHAT_BUTTON_HEADER}
            />
            <PlayerButton
              itemId={item.id}
              origin={{ rootId: item.id, context: Context.Builder }}
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
    item.id,
    (currentMember as CompleteMember)?.id,
    itemMemberships,
  );

  return (
    <SafeAreaView style={styles.container} edges={['left']}>
      <ItemsList
        parentId={item.id}
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
    flexDirection: 'row',
    width: 82,
  },
});

export default FolderItem;
