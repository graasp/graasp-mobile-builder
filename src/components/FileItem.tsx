import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { FC, useEffect, useState } from 'react';

import * as Api from '../api';
import { MIME_TYPES } from '../config/constants/constants';
import { Item, S3FileItemExtra } from '../types';
import { getFileExtensionFromMimeType } from '../utils/functions/helper';
import { getS3FileExtra } from '../utils/functions/item';
import { getUserToken } from '../utils/functions/token';
import ActivityIndicator from './ActivityIndicator';
import FileAudio from './FileAudio';
import FileImage from './FileImage';
import FilePdf from './FilePdf';
import FileUnsupported from './FileUnsupported';
import FileVideo from './FileVideo';

interface FileItemProps {
  item: Item;
}

const FileItem: FC<FileItemProps> = ({ item }) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(true);
  const [localPath, setLocalPath] = useState<string | undefined>(undefined);

  const userToken: any = getUserToken();

  const extra = getS3FileExtra(item.extra as S3FileItemExtra);
  const { mimetype } = extra ?? {};

  const downloadFile = async () => {
    try {
      const itemFile = await Api.getItemFileUrl(item.id, userToken).then(
        (data) => data,
      );

      let localPath;
      if (mimetype) {
        const extension = getFileExtensionFromMimeType(mimetype);
        localPath = `${FileSystem.documentDirectory}/${item.id}${
          extension ? '.' : ''
        }${extension ? extension : ''}`;
        console.log(localPath);
      } else {
        localPath = `${FileSystem.documentDirectory}/${item.id}`;
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        itemFile.url,
        localPath,
      );
      await downloadResumable.downloadAsync();

      setLocalPath(localPath);
      setIsDownloading(false);
    } catch {
      throw new Error();
    }
  };

  useEffect(() => {
    downloadFile();
  }, []);

  if (isDownloading) {
    return <ActivityIndicator />;
  }

  const handleSaveFile = () => {
    if (localPath) {
      Sharing.shareAsync(localPath);
    }
  };

  if (mimetype && localPath) {
    if (MIME_TYPES.IMAGE.includes(mimetype)) {
      return (
        <FileImage localPath={localPath} handleSaveFile={handleSaveFile} />
      );
    } else if (MIME_TYPES.AUDIO.includes(mimetype)) {
      return (
        <FileAudio localPath={localPath} handleSaveFile={handleSaveFile} />
      );
    } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
      return (
        <FileVideo localPath={localPath} handleSaveFile={handleSaveFile} />
      );
    } else if (MIME_TYPES.PDF.includes(mimetype)) {
      return <FilePdf localPath={localPath} handleSaveFile={handleSaveFile} />;
    }
  }
  if (localPath) {
    return (
      <FileUnsupported localPath={localPath} handleSaveFile={handleSaveFile} />
    );
  }
  return null;
};

export default FileItem;
