import { FC, useCallback, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { buildItemsListTestId } from '../../e2e/constants/testIds';
import { BOTTOM_SNAP_POINTS_ITEM_LIST } from '../config/constants/constants';
import { bottomSheetModalStyles } from '../utils/styles';
import AddItem from './AddItem';
import Item from './Item';
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
  /* Disable or enable the bottom sheet animateOnMount property depending on the reduced motion setting of the device. 
  It solves the bug introduced in react-native-reanimated with SDK 50 and it should be fixed in @gorhom/bottom-sheet v5 */
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
            {itemSelected && (
              <ItemListOptions
                itemSelected={itemSelected}
                bottomSheetModalRef={bottomSheetModalRef}
                refresh={refresh}
              />
            )}
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
      {displayAddItem && <AddItem parentId={parentId} refresh={refresh} />}
    </>
  );
};

export default ItemsList;
