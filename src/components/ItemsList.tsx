import { FC } from 'react';
import { FlatList, View } from 'react-native';
import { Divider } from 'react-native-elements';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { buildItemsListTestId } from '../../e2e/constants/testIds';
import AddItem from './AddItem';
import Item from './Item';
import EmptyList from './common/EmptyList';

interface ItemsListProps {
  parentId?: UUID;
  items: DiscriminatedItem[];
  refresh: () => void;
  isLoading: boolean;
  displayAddItem?: boolean;
}

const ItemsList: FC<ItemsListProps> = ({
  parentId,
  items,
  refresh,
  isLoading,
  displayAddItem = true,
}) => {
  const renderItem = ({
    item,
    index,
  }: {
    item: DiscriminatedItem;
    index: number;
  }) => {
    return <Item item={item} showOptions index={index} refresh={refresh} />;
  };

  return (
    <>
      <FlatList
        testID={parentId ? buildItemsListTestId(parentId) : undefined}
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        onRefresh={refresh}
        refreshing={isLoading}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={<EmptyList />}
        ItemSeparatorComponent={() => (
          <View style={{ alignItems: 'center' }}>
            <Divider style={{ width: '90%' }} />
          </View>
        )}
      />
      {displayAddItem && <AddItem parentId={parentId} refresh={refresh} />}
    </>
  );
};

export default ItemsList;
