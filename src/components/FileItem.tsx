import * as FileSystem from 'expo-file-system';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';

import * as Api from '../api';
import { MIME_TYPES } from '../config/constants/constants';
import { Item, S3FileItemExtra } from '../types';
import { getS3FileExtra } from '../utils/functions/item';
import { getUserToken } from '../utils/functions/token';
import ActivityIndicator from './ActivityIndicator';

interface FileItemProps {
  item: Item;
}

const FileItem: FC<FileItemProps> = ({ item }) => {
  console.log(item);
  const [isDownloading, setIsDownloading] = useState<boolean>(true);
  const [localPath, setLocalPath] = useState<string | undefined>(undefined);

  const userToken: any = getUserToken();

  const downloadFile = async () => {
    try {
      const itemFile = await Api.getItemFileUrl(item.id, userToken).then(
        (data) => data,
      );
      const localPath = `${FileSystem.documentDirectory}/${item.id}`;
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

  const extra = getS3FileExtra(item.extra as S3FileItemExtra);
  const { mimetype } = extra ?? {};

  if (mimetype) {
    if (MIME_TYPES.IMAGE.includes(mimetype)) {
      return (
        <Image
          resizeMode="contain"
          style={styles.image}
          source={{
            uri: localPath,
          }}
        />
      );
    } else if (MIME_TYPES.AUDIO.includes(mimetype)) {
      return null;
    } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
      return null;
    } else if (MIME_TYPES.PDF.includes(mimetype)) {
      return null;
    }
  }
  return null;
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

export default FileItem;
