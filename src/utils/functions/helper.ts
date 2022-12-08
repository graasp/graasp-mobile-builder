import { MIME_TYPES_EXTENSIONS } from '../../config/constants/constants';

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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

export { validateEmail, getFileExtension, getFileExtensionFromMimeType };
