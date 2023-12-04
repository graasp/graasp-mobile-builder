import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, ListItem } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

import { MaterialIcons } from '@expo/vector-icons';
import 'expo-document-picker';

import { DiscriminatedItem } from '@graasp/sdk';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';

import { PLAYER_COLOR } from '../config/constants/constants';
import ItemIcon from './ItemIcon';
import CustomBackdrop from './common/CustomBackdrop';

interface PlayerFolderMenuProps {
  folderItems: DiscriminatedItem[];
}

const PlayerFolderMenu: FC<PlayerFolderMenuProps> = ({ folderItems }) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const bottomSheetMenuPlayerModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%', '95%'], []);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    if (selectedItem) {
      bottomSheetMenuPlayerModalRef.current?.close();
      navigation.navigate('CommonStack', {
        screen: 'CommonStackPlayerFolder',
        params: {
          itemId: selectedItem.id,
          headerTitle: selectedItem.name,
          builderItemId: route.params?.builderItemId,
        },
      });
    }
  }, [selectedItem]);

  const renderItem = ({ item }: { item: DiscriminatedItem }) => {
    return (
      <Pressable onPress={() => setSelectedItem(item)} style={{ flex: 2 }}>
        <ListItem>
          <ItemIcon type={item.type} extra={item.extra} />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>{item.name}</ListItem.Title>
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
        containerStyle={{ flex: 1 }}
        ref={bottomSheetMenuPlayerModalRef}
        style={styles.bottomSheetModal}
        index={0}
        snapPoints={snapPoints}
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
        <MaterialIcons name="menu" color="#ffffff" size={25} />
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
