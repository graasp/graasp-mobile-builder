import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiscriminatedItem, UUID } from '@graasp/sdk';

import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../config/constants/constants';
import { MyItemsStackPropsNavigationProp } from '../screens/MyItemsScreen';
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
  const navigation = useNavigation<MyItemsStackPropsNavigationProp>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['45%', '60%', '90%'], []);
  const [itemSelected, setItemSelected] = useState<DiscriminatedItem | null>(
    null,
  );
  const insets = useSafeAreaInsets();

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

  const renderItem = ({ item }: { item: DiscriminatedItem }) => {
    return <Item item={item} openOptions={handlePresentModalPress} />;
  };

  return (
    <>
      <FlatList
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
        ref={bottomSheetModalRef}
        style={styles.bottomSheetModal}
        index={0}
        snapPoints={snapPoints}
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
                    name={itemSelected.name}
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
                  navigation={navigation}
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

const styles = StyleSheet.create({
  itemContainer: {
    padding: 6,
    margin: 6,
  },
  sectionHeaderContainer: {
    backgroundColor: 'white',
    padding: 6,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addItemButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    elevation: 8,
  },
  bottomSheetModal: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default ItemsList;
