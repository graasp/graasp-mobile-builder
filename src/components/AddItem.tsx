import { FC, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ListItem, Overlay } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { API_ROUTES } from '@graasp/query-client';
import { UUID } from '@graasp/sdk';

import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

import {
  ADD_DOCUMENTS,
  ADD_IMAGES_AND_VIDEOS,
  ADD_ITEMS,
  CREATE_FOLDER,
} from '../../e2e/constants/testIds';
import {
  ANALYTICS_EVENTS,
  BOTTOM_SNAP_POINTS_ADD_ITEM,
  PRIMARY_COLOR,
  STATUS_CODES_OK,
} from '../config/constants/constants';
import { API_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import ActivityIndicator from './ActivityIndicator';
import CreateFolder from './CreateFolder';
import CustomBackdrop from './common/CustomBackdrop';

interface AddItemProps {
  parentId?: UUID;
  refresh: () => void;
}

const AddItem: FC<AddItemProps> = ({ parentId, refresh }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const bottomSheetAddItemModalRef = useRef<BottomSheetModal>(null);
  const { userToken: token } = useAuth();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [createItemModalVisible, setCreateItemModalVisible] = useState<{
    toggle: boolean;
  }>({
    toggle: false,
  });
  /* Disable or enable the bottom sheet animateOnMount property depending on the reduced motion setting of the device. 
  It solves the bug introduced in react-native-reanimated with SDK 50 and it should be fixed in @gorhom/bottom-sheet v5 */
  const reducedMotion = useReducedMotion();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!file.canceled && file.assets && file.assets.length !== 0) {
      uploadFile(file.assets[0].uri);
      bottomSheetAddItemModalRef.current?.close();
      await customAnalyticsEvent(ANALYTICS_EVENTS.UPLOAD_ITEM, {
        source: 'gallery',
        type: file.assets[0].type,
      });
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    if (!result.canceled) {
      result.assets.forEach(async (file) => {
        uploadFile(file.uri);
        bottomSheetAddItemModalRef.current?.close();
        await customAnalyticsEvent(ANALYTICS_EVENTS.UPLOAD_ITEM, {
          source: 'file_manager',
          type: file.mimeType,
        });
      });
    }
  };

  const uploadFile = async (fileUri: string) => {
    try {
      setIsUploading(true);
      const uploadResponse = await FileSystem.uploadAsync(
        `${API_HOST}/${API_ROUTES.buildUploadFilesRoute(parentId)}`,
        fileUri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!STATUS_CODES_OK.includes(uploadResponse.status)) {
        throw new Error('Upload file error');
      }
      refresh();
      setIsUploading(false);
      Toast.show({
        type: 'success',
        text1: t('Success'),
        text2: t('File uploaded correctly'),
      });
    } catch {
      setIsUploading(false);
      Toast.show({
        type: 'error',
        text1: t('Error'),
        text2: t('There was an error uploading the file'),
      });
      Alert.alert(t('Upload error'), t('Please try again'), [{ text: 'OK' }]);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleAddItemSheetChanges', index);
  }, []);

  const handleAddFolderPress = () => {
    setCreateItemModalVisible({ toggle: true });
  };

  const handleAddImageOrVideoPress = () => {
    pickImage();
  };

  const handleAddDocumentPress = () => {
    pickDocument();
  };

  const handleOpenBottomSheetAddItemModal = useCallback(() => {
    bottomSheetAddItemModalRef.current?.present();
  }, []);

  return (
    <>
      <Overlay
        overlayStyle={styles.modalCreateItemView}
        isVisible={createItemModalVisible.toggle}
        onBackdropPress={() => setCreateItemModalVisible({ toggle: false })}
      >
        <CreateFolder
          refresh={refresh}
          setCreateItemModalVisible={setCreateItemModalVisible}
          bottomSheetAddItemModalRef={bottomSheetAddItemModalRef}
          parentId={parentId}
        />
      </Overlay>
      <BottomSheetModal
        animateOnMount={!reducedMotion}
        ref={bottomSheetAddItemModalRef}
        style={styles.bottomSheetModal}
        index={0}
        snapPoints={BOTTOM_SNAP_POINTS_ADD_ITEM}
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
            <BottomSheetScrollView contentContainerStyle={null}>
              <ListItem
                onPress={() => handleAddFolderPress()}
                style={{ paddingLeft: insets.left }}
                testID={CREATE_FOLDER}
              >
                <MaterialIcons name="folder" size={24} color="grey" />
                <ListItem.Content style={{ flexDirection: 'row' }}>
                  <ListItem.Title style={{ flex: 2 }}>
                    {t('Folder')}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                onPress={() => handleAddImageOrVideoPress()}
                style={{ paddingLeft: insets.left }}
                testID={ADD_IMAGES_AND_VIDEOS}
              >
                <MaterialIcons name="image" size={24} color="grey" />
                <ListItem.Content style={{ flexDirection: 'row' }}>
                  <ListItem.Title style={{ flex: 2 }}>
                    {t('Images and videos')}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                onPress={() => handleAddDocumentPress()}
                style={{ paddingLeft: insets.left }}
                testID={ADD_DOCUMENTS}
              >
                <MaterialIcons
                  name="insert-drive-file"
                  size={24}
                  color="grey"
                />
                <ListItem.Content style={{ flexDirection: 'row' }}>
                  <ListItem.Title style={{ flex: 2 }}>
                    {t('Documents')}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </BottomSheetScrollView>
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>

      {isUploading ? (
        <TouchableOpacity disabled style={styles.addItemButton}>
          <ActivityIndicator color={'#ffffff'} size="small" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleOpenBottomSheetAddItemModal}
          style={styles.addItemButton}
          testID={ADD_ITEMS}
        >
          <MaterialIcons name={'add'} color="#ffffff" size={25} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
  modalCreateItemView: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '85%',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AddItem;
