import { MIME_TYPES_EXTENSIONS } from '../../config/constants/constants';

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

export { getFileExtension, getFileExtensionFromMimeType };
