import { useCallback, useRef } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';

import { MaterialIcons } from '@expo/vector-icons';
import 'expo-document-picker';

import { Context, DiscriminatedItem } from '@graasp/sdk';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';

import {
  PLAYER_FOLDER_MENU,
  buildPlayerFolderMenuItem,
} from '../../e2e/constants/testIds';
import {
  BOTTOM_SNAP_POINTS_PLAYER,
  PLAYER_COLOR,
} from '../config/constants/constants';
import {
  ITEM_NAVIGATOR,
  ITEM_NAVIGATOR_PLAYER_FOLDER,
} from '../navigation/names';
import { ItemScreenProps } from '../navigation/types';
import ItemIcon from './ItemIcon';
import CustomBackdrop from './common/CustomBackdrop';

interface PlayerFolderMenuProps {
  folderItems: DiscriminatedItem[];
  /**
   * root where the player view will exit
   * */
  origin: { rootId: DiscriminatedItem['id']; context: Context };
}

const PlayerFolderMenu = ({ folderItems, origin }: PlayerFolderMenuProps) => {
  const { navigate } =
    useNavigation<ItemScreenProps<'ItemStackPlayerFolder'>['navigation']>();
  const bottomSheetMenuPlayerModalRef = useRef<BottomSheetModal>(null);
  const reducedMotion = useReducedMotion();

  const navigatePlayerFolder = (item: DiscriminatedItem) => {
    bottomSheetMenuPlayerModalRef.current?.close();
    navigate(ITEM_NAVIGATOR, {
      screen: ITEM_NAVIGATOR_PLAYER_FOLDER,
      params: {
        origin,
        itemId: item.id,
        headerTitle: item.name,
      },
    });
  };

  const renderItem = ({ item }: { item: DiscriminatedItem }) => {
    return (
      <Pressable onPress={() => navigatePlayerFolder(item)} style={{ flex: 2 }}>
        <ListItem>
          <ItemIcon type={item.type} extra={item.extra} />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title
              testID={buildPlayerFolderMenuItem(item.id)}
              style={{ flex: 2 }}
            >
              {item.name}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Pressable>
    );
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleMenuPlayerSheetChanges', index);
  }, []);

  const handleOpenBottomSheetMenuPlayerModal = useCallback(() => {
    bottomSheetMenuPlayerModalRef.current?.present();
  }, []);

  return (
    <>
      <BottomSheetModal
        animateOnMount={!reducedMotion}
        containerStyle={{ flex: 1 }}
        ref={bottomSheetMenuPlayerModalRef}
        style={styles.bottomSheetModal}
        index={0}
        snapPoints={BOTTOM_SNAP_POINTS_PLAYER}
        onChange={handleSheetChanges}
        backdropComponent={({ animatedIndex, style: backDropStyle }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={backDropStyle}
            onBackDropPressed={() =>
              bottomSheetMenuPlayerModalRef.current?.close()
            }
          />
        )}
      >
        <NativeViewGestureHandler disallowInterruption={true}>
          <View style={{ flex: 1 }}>
            <FlatList
              style={styles.flatList}
              data={folderItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={true}
              contentContainerStyle={{ flexGrow: 1 }}
              ItemSeparatorComponent={() => (
                <Divider
                  style={{
                    width: '90%',
                    marginHorizontal: 10,
                    marginBottom: 10,
                  }}
                />
              )}
            />
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
      <TouchableOpacity
        onPress={handleOpenBottomSheetMenuPlayerModal}
        style={styles.menuPlayerButton}
      >
        <MaterialIcons
          name="menu"
          color="#ffffff"
          size={25}
          testID={PLAYER_FOLDER_MENU}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  menuPlayerButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: PLAYER_COLOR,
    borderRadius: 30,
    elevation: 8,
  },
  menuIcon: {
    paddingRight: 2,
  },
  menuText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
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
  flatList: {
    height: '100%',
  },
});

export default PlayerFolderMenu;
