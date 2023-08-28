import * as Sharing from 'expo-sharing';
import React, { FC, useEffect, useState } from 'react';

import * as Api from '../api';
import { ANALYTICS_EVENTS, MIME_TYPES } from '../config/constants/constants';
import { FileType, Item, S3FileItemExtra } from '../types';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { getS3FileExtra } from '../utils/functions/item';
import { downloadFileFromS3Url } from '../utils/functions/media';
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
  const [filePath, setFilePath] = useState<string | undefined>(undefined);

  const userToken: any = getUserToken();

  const extra = getS3FileExtra(item.extra as S3FileItemExtra);
  const { mimetype } = extra ?? {};

  const getFileUrl = async () => {
    try {
      const itemFile = await Api.getItemFileUrl(item.id, userToken).then(
        (data) => data,
      );
      if (
        mimetype &&
        MIME_TYPES.PDF.concat(MIME_TYPES.VIDEO).includes(mimetype)
      ) {
        setFilePath(itemFile);
        setIsDownloading(false);
        return;
      }
      downloadFile(itemFile);
    } catch {
      throw new Error();
    }
  };

  const downloadFile = async (remoteUrl: string) => {
    try {
      const filePath = await downloadFileFromS3Url(
        remoteUrl,
        item.id,
        mimetype,
      );
      setFilePath(filePath);
      setIsDownloading(false);
    } catch {
      throw new Error();
    }
  };

  useEffect(() => {
    getFileUrl();
  }, []);

  if (isDownloading) {
    return <ActivityIndicator />;
  }

  const handleShareFile = async (itemType: FileType) => {
    if (filePath) {
      Sharing.shareAsync(filePath);
      await customAnalyticsEvent(ANALYTICS_EVENTS.SHARE_ITEM, {
        item_type: itemType,
      });
    }
  };

  if (mimetype && filePath) {
    if (MIME_TYPES.IMAGE.includes(mimetype)) {
      return (
        <FileImage filePath={filePath} handleShareFile={handleShareFile} />
      );
    } else if (MIME_TYPES.AUDIO.includes(mimetype)) {
      return (
        <FileAudio filePath={filePath} handleShareFile={handleShareFile} />
      );
    } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
      return (
        <FileVideo filePath={filePath} itemId={item.id} mimetype={mimetype} />
      );
    } else if (MIME_TYPES.PDF.includes(mimetype)) {
      return (
        <FilePdf filePath={filePath} itemId={item.id} mimetype={mimetype} />
      );
    }
  }
  if (filePath) {
    return (
      <FileUnsupported filePath={filePath} handleShareFile={handleShareFile} />
    );
  }
  return null;
};

export default FileItem;
