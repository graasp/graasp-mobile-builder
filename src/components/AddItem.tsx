import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as DocumentPicker from 'expo-document-picker';
import {} from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { ImageInfo } from 'expo-image-picker';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildUploadFilesRoute } from '../api/routes';
import { STATUS_CODES_OK } from '../config/constants/constants';
import { UUID } from '../types';
import { getUserToken } from '../utils/functions/token';
import ActivityIndicator from './ActivityIndicator';
import CustomBackdrop from './common/CustomBackdrop';

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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!file.cancelled) {
      uploadImage(file);
      bottomSheetAddItemModalRef.current?.close()
    }
  };

  const pickDocument = async () => {
    const file = await DocumentPicker.getDocumentAsync();

    if (file.type !== 'cancel') {
      uploadImage(file);
      bottomSheetAddItemModalRef.current?.close()
    }
  };

  const uploadImage = async (
    file:
      | ImageInfo
      | Extract<DocumentPicker.DocumentResult, { type: 'success' }>,
  ) => {
    try {
      console.log(buildUploadFilesRoute(parentId))
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
    } catch {
      setIsUploading(false);
      Alert.alert('Upload error', 'Please try again', [{ text: 'OK' }]);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleAddImageOrVideoPress = () => {
    pickImage();
  };

  const handleAddDocumentPress = () => {
    pickDocument();
  };

  const handleOpenBottomSheetAddItemModal = () => {
    bottomSheetAddItemModalRef.current?.present();
  };

  return (
    <>
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
        <BottomSheetScrollView contentContainerStyle={null}>
          <ListItem
            onPress={() => handleAddImageOrVideoPress()}
            style={{ paddingLeft: insets.left }}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <MaterialIcons name="image" size={24} color="grey" />
            <ListItem.Content style={{ flexDirection: 'row' }}>
              <ListItem.Title style={{ flex: 2 }}>
                Images and videos
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            onPress={() => handleAddDocumentPress()}
            style={{ paddingLeft: insets.left }}
            hasTVPreferredFocus={undefined}
            tvParallaxProperties={undefined}
          >
            <MaterialIcons name="insert-drive-file" size={24} color="grey" />
            <ListItem.Content style={{ flexDirection: 'row' }}>
              <ListItem.Title style={{ flex: 2 }}>Documents</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </BottomSheetScrollView>
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
});

export default AddItem;
