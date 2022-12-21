import * as Sharing from 'expo-sharing';
import React, { FC, useEffect, useState } from 'react';

import * as Api from '../api';
import { MIME_TYPES } from '../config/constants/constants';
import { Item, S3FileItemExtra } from '../types';
import { getS3FileExtra } from '../utils/functions/item';
import { downloadFileFromS3Url } from '../utils/functions/media';
import { getUserToken } from '../utils/functions/token';
import ActivityIndicator from './ActivityIndicator';
import FileAudio from './FileAudio';
import FileAudioPlayer from './FileAudioPlayer';
import FileImage from './FileImage';
import FileImagePlayer from './FileImagePlayer';
import FilePdf from './FilePdf';
import FilePdfPlayer from './FilePdfPlayer';
import FileUnsupported from './FileUnsupported';
import FileVideo from './FileVideo';
import FileVideoPlayer from './FileVideoPlayer';

interface FileItemProps {
  item: Item;
  isPlayerView?: boolean;
}

const FileItem: FC<FileItemProps> = ({ item, isPlayerView = false }) => {
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
        setFilePath(itemFile.url);
        setIsDownloading(false);
        return;
      }
      downloadFile(itemFile.url);
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

  const handleShareFile = () => {
    if (filePath) {
      Sharing.shareAsync(filePath);
    }
  };

  if (mimetype && filePath) {
    if (MIME_TYPES.IMAGE.includes(mimetype)) {
      return isPlayerView ? (
        <FileImagePlayer filePath={filePath} />
      ) : (
        <FileImage filePath={filePath} handleShareFile={handleShareFile} />
      );
    } else if (MIME_TYPES.AUDIO.includes(mimetype)) {
      return isPlayerView ? (
        <FileAudioPlayer filePath={filePath} />
      ) : (
        <FileAudio filePath={filePath} handleShareFile={handleShareFile} />
      );
    } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
      return isPlayerView ? (
        <FileVideoPlayer filePath={filePath} />
      ) : (
        <FileVideo filePath={filePath} itemId={item.id} mimetype={mimetype} />
      );
    } else if (MIME_TYPES.PDF.includes(mimetype)) {
      return isPlayerView ? (
        <FilePdfPlayer filePath={filePath} />
      ) : (
        <FilePdf filePath={filePath} itemId={item.id} mimetype={mimetype} />
      );
    }
  }
  if (filePath) {
    return isPlayerView ? null : (
      <FileUnsupported filePath={filePath} handleShareFile={handleShareFile} />
    );
  }
  return null;
};

export default FileItem;
