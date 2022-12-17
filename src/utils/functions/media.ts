import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

import { MEDIA_LIBRARY_PERMISSION_STATUS } from '../../config/constants/constants';
import { UUID } from '../../types';
import { getFileExtensionFromMimeType } from './helper';

export const saveMedia = async (uri: string) => {
  try {
    // Request device storage access permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === MEDIA_LIBRARY_PERMISSION_STATUS.GRANTED) {
      // Save image to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      console.log('Image successfully saved');
    } else {
      Alert.alert(
        'You need to allow photos permission to Graasp',
        'Go to Settings > Graasp > Photos > Select "All the photos"',
        [{ text: 'OK' }],
      );
    }
  } catch (error) {
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

    const downloadResumable = FileSystem.createDownloadResumable(
      remoteUrl,
      localPath,
    );
    await downloadResumable.downloadAsync();

    return localPath;
  } catch {
    throw new Error();
  }
};
