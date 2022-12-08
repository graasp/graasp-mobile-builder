import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

import { MEDIA_LIBRARY_PERMISSION_STATUS } from '../../config/constants/constants';

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
