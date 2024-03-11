import { FC, useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { buildItemsListTestId } from '../../e2e/constants/testIds';
import { BOTTOM_SNAP_POINTS_ITEM_LIST } from '../config/constants/constants';
import { bottomSheetModalStyles } from '../utils/styles';
import AddItem from './AddItem';
import Item from './Item';
import ItemIcon from './ItemIcon';
import ItemListOptions from './ItemListOptions';
import CustomBackdrop from './common/CustomBackdrop';
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [itemSelected, setItemSelected] = useState<DiscriminatedItem | null>(
    null,
  );
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  const handlePresentModalPress = useCallback(
    ({ id }: { id: UUID }) => {
      console.log('pressed itemId: ', id);
      const itemSelected = items.find((it: DiscriminatedItem) => it.id === id);
      console.log('item selected is: ', itemSelected);
      if (itemSelected) {
        setItemSelected(itemSelected);
        bottomSheetModalRef.current?.present();
      }
    },
    [items],
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderItem = ({
    item,
    index,
  }: {
    item: DiscriminatedItem;
    index: number;
  }) => {
    return (
      <Item
        item={item}
        openOptions={handlePresentModalPress}
        index={index}
        parentItemId={parentId}
      />
    );
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
          <Divider
            style={{ width: '90%', marginHorizontal: 10, marginBottom: 10 }}
          />
        )}
      />
      <BottomSheetModal
        animateOnMount={!reducedMotion}
        ref={bottomSheetModalRef}
        style={bottomSheetModalStyles.bottomSheetModal}
        index={0}
        snapPoints={BOTTOM_SNAP_POINTS_ITEM_LIST}
        onChange={handleSheetChanges}
        backdropComponent={({ animatedIndex, style: backDropStyle }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={backDropStyle}
            onBackDropPressed={() => bottomSheetModalRef.current?.close()}
          />
        )}
      >
        <NativeViewGestureHandler disallowInterruption={true}>
          <View style={{ flex: 1 }}>
            {itemSelected && Boolean(itemSelected?.name) && (
              <>
                <ListItem style={{ paddingLeft: insets.left }}>
                  <ItemIcon
                    type={itemSelected.type}
                    extra={itemSelected.extra}
                  />
                  <ListItem.Content style={{ flexDirection: 'row' }}>
                    <ListItem.Title style={{ flex: 2 }}>
                      {itemSelected.name}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <Divider
                  style={{
                    width: '100%',
                    marginBottom: 10,
                    marginLeft: insets.left,
                  }}
                />
              </>
            )}
            {itemSelected && (
              <BottomSheetScrollView contentContainerStyle={null}>
                <ItemListOptions
                  itemSelected={itemSelected}
                  bottomSheetModalRef={bottomSheetModalRef}
                  refresh={refresh}
                />
              </BottomSheetScrollView>
            )}
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
      {displayAddItem && <AddItem parentId={parentId} refresh={refresh} />}
    </>
  );
};

export default ItemsList;
