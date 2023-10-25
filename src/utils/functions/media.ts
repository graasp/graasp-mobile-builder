import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { MEDIA_LIBRARY_PERMISSION_STATUS } from '../../config/constants/constants';
import { UUID } from '../../types';
import { getFileExtensionFromMimeType } from './helper';

export const saveMedia = async (uri: string, t: any) => {
  try {
    // Request device storage access permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === MEDIA_LIBRARY_PERMISSION_STATUS.GRANTED) {
      // Save image to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      Toast.show({
        type: 'success',
        text1: t('Success')!,
        text2: t('Saved correctly in your media gallery')!,
      });
      console.log('Media successfully saved');
    } else {
      Alert.alert(
        t('You need to allow photos permission to Graasp'),
        t('Go to Settings > Graasp > Photos > Select "All the photos"')!,
        [{ text: 'OK' }],
      );
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: t('Error')!,
      text2: t('There was an error saving the file')!,
    });
    throw new Error();
  }
};

export const downloadFileFromS3Url = async (
  remoteUrl: string,
  itemId: UUID,
  mimetype?: string,
) => {
  try {
    let localPath;
    if (mimetype) {
      const extension = getFileExtensionFromMimeType(mimetype);
      localPath = `${FileSystem.documentDirectory}${itemId}${
        extension ? '.' : ''
      }${extension ? extension : ''}`;
      console.log(localPath);
    } else {
      localPath = `${FileSystem.documentDirectory}/${itemId}`;
    }

    const fileInfo = await FileSystem.getInfoAsync(localPath);

    if (!fileInfo.exists) {
      const downloadResumable = FileSystem.createDownloadResumable(
        remoteUrl,
        localPath,
      );
      await downloadResumable.downloadAsync();
    }
    return localPath;
  } catch {
    throw new Error();
  }
};
