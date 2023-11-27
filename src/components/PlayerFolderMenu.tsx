import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider, ListItem, Text } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';

import { MaterialIcons } from '@expo/vector-icons';
import 'expo-document-picker';

import { Item as ItemType } from '@graasp/sdk';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';

import { PLAYER_COLOR } from '../config/constants/constants';
import ItemIcon from './ItemIcon';
import CustomBackdrop from './common/CustomBackdrop';
import EmptyList from './common/EmptyList';

interface PlayerFolderMenuProps {
  folderItems: ItemType[];
}

const PlayerFolderMenu: FC<PlayerFolderMenuProps> = ({ folderItems }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const bottomSheetAddItemModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%', '95%'], []);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  useEffect(() => {
    if (selectedItem) {
      bottomSheetAddItemModalRef.current?.close();
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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Pressable onPress={() => setSelectedItem(item)} style={{ flex: 2 }}>
        <ListItem>
          <ItemIcon type={item.type} extra={item.extra} name={item.name} />
          <ListItem.Content style={{ flexDirection: 'row' }}>
            <ListItem.Title style={{ flex: 2 }}>{item.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Pressable>
    );
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleAddItemSheetChanges', index);
  }, []);

  const handleOpenBottomSheetAddItemModal = useCallback(() => {
    bottomSheetAddItemModalRef.current?.present();
  }, []);

  return (
    <>
      <BottomSheetModal
        containerStyle={{ flex: 1 }}
        ref={bottomSheetAddItemModalRef}
        style={styles.bottomSheetModal}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={({ animatedIndex, style: backDropStyle }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={backDropStyle}
            onBackDropPressed={() =>
              bottomSheetAddItemModalRef.current?.close()
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
              ListEmptyComponent={<EmptyList />}
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
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleOpenBottomSheetAddItemModal}
          style={styles.menuItemButton}
        >
          <MaterialIcons
            style={styles.menuIcon}
            name={'folder'}
            color="#ffffff"
            size={25}
          />
          <Text style={styles.menuText}>{t('Menu')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  menuItemButton: {
    position: 'absolute',
    width: '80%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    bottom: 20,
    backgroundColor: PLAYER_COLOR,
    borderRadius: 30,
    elevation: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
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
