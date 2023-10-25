import Toast from 'react-native-toast-message';

import * as Linking from 'expo-linking';

import {
  LOGIN_URI,
  MIME_TYPES_EXTENSIONS,
} from '../../config/constants/constants';

function getFileExtension(fileName: string) {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(fileName)![1];
  if (!ext) {
    return '';
  }
  return ext;
}

function getFileExtensionFromMimeType(mimetype: string) {
  const mimeTypePosition = MIME_TYPES_EXTENSIONS.MIME_TYPES.indexOf(mimetype);

  if (mimeTypePosition !== -1) {
    return MIME_TYPES_EXTENSIONS.EXTENSIONS[mimeTypePosition];
  }
  return undefined;
}

function checkLoginUri(parsedUrl: Linking.ParsedURL) {
  const { scheme, path, hostname, queryParams } = parsedUrl;
  if (
    queryParams?.t &&
    ((scheme === LOGIN_URI.APP_SCHEME.SCHEME &&
      hostname === LOGIN_URI.APP_SCHEME.HOSTNAME) ||
      (hostname === LOGIN_URI.DEEP_LINK.HOSTNAME &&
        path === LOGIN_URI.DEEP_LINK.PATH))
  ) {
    return true;
  } else {
    Toast.show({
      type: 'error',
      text1: 'Error logging in',
    });
    return false;
  }
}

export { getFileExtension, getFileExtensionFromMimeType, checkLoginUri };
