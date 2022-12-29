import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as DocumentPicker from 'expo-document-picker';
import {} from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, StyleSheet, Alert, View } from 'react-native';
import { ListItem, Overlay } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { buildUploadFilesRoute } from '../api/routes';
import { STATUS_CODES_OK } from '../config/constants/constants';
import { UUID } from '../types';
import { getUserToken } from '../utils/functions/token';
import ActivityIndicator from './ActivityIndicator';
import CustomBackdrop from './common/CustomBackdrop';
import CreateFolder from './CreateFolder';

interface AddItemProps {
  parentId?: UUID;
  refresh: () => void;
}

const AddItem: FC<AddItemProps> = ({ parentId, refresh }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const bottomSheetAddItemModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const token: any = getUserToken();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [createItemModalVisible, setCreateItemModalVisible] = useState<{
    toggle: boolean;
  }>({
    toggle: false,
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!file.cancelled) {
      uploadImage(file);
      bottomSheetAddItemModalRef.current?.close();
    }
  };

  const pickDocument = async () => {
    const file = await DocumentPicker.getDocumentAsync();

    if (file.type !== 'cancel') {
      uploadImage(file);
      bottomSheetAddItemModalRef.current?.close();
    }
  };

  const uploadImage = async (
    file:
      | ImagePicker.ImageInfo
      | Extract<DocumentPicker.DocumentResult, { type: 'success' }>,
  ) => {
    try {
      setIsUploading(true);
      const uploadResponse = await FileSystem.uploadAsync(
        buildUploadFilesRoute(parentId),
        file.uri,
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
        text1: t('Success')!,
        text2: t('File uploaded correctly')!,
      });
    } catch {
      setIsUploading(false);
      Toast.show({
        type: 'error',
        text1: t('Error')!,
        text2: t('There was an error uploading the file')!,
      });
      Alert.alert(t('Upload error'), t('Please try again')!, [{ text: 'OK' }]);
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
        isVisible={
          createItemModalVisible.toggle
        }
        onBackdropPress={() =>
          setCreateItemModalVisible({ toggle: false })
        }
      >
        <CreateFolder refresh={refresh} setCreateItemModalVisible={setCreateItemModalVisible} bottomSheetAddItemModalRef={bottomSheetAddItemModalRef} parentId={parentId} />
      </Overlay>
      <BottomSheetModal
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
            <BottomSheetScrollView contentContainerStyle={null}>
            <ListItem
                onPress={() => handleAddFolderPress()}
                style={{ paddingLeft: insets.left }}
                hasTVPreferredFocus={undefined}
                tvParallaxProperties={undefined}
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
                hasTVPreferredFocus={undefined}
                tvParallaxProperties={undefined}
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
                hasTVPreferredFocus={undefined}
                tvParallaxProperties={undefined}
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
    backgroundColor: '#5050d2',
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
