import { FC, useEffect, useState } from 'react';

import * as Sharing from 'expo-sharing';

import {
  DiscriminatedItem,
  S3FileItemExtra,
  getS3FileExtra,
} from '@graasp/sdk';

import { ANALYTICS_EVENTS, MIME_TYPES } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { downloadFileFromS3Url } from '../utils/functions/media';
import ActivityIndicator from './ActivityIndicator';
import FileAudio from './FileAudio';
import FileImage from './FileImage';
import FilePdf from './FilePdf';
import FileUnsupported from './FileUnsupported';
import FileVideo from './FileVideo';

interface FileItemProps {
  item: DiscriminatedItem;
  isPlayerView?: boolean;
}

const FileItem: FC<FileItemProps> = ({ item, isPlayerView = false }) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(true);
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const { hooks } = useQueryClient();

  const extra = getS3FileExtra(item.extra as S3FileItemExtra);
  const { mimetype } = extra ?? {};

  const { data: url } = hooks.useFileContentUrl(item.id);

  useEffect(() => {
    if (url) {
      try {
        if (
          mimetype &&
          MIME_TYPES.PDF.concat(MIME_TYPES.VIDEO).includes(mimetype)
        ) {
          setFilePath(url);
          setIsDownloading(false);
        } else {
          // download file
          downloadFileFromS3Url(url, item.id, mimetype).then((localPath) => {
            setFilePath(localPath);
            setIsDownloading(false);
          });
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }, [url]);

  if (isDownloading) {
    return <ActivityIndicator />;
  }

  const handleShareFile = (mimetype: string) => async () => {
    if (filePath) {
      Sharing.shareAsync(filePath);
      await customAnalyticsEvent(ANALYTICS_EVENTS.SHARE_ITEM, {
        item_type: mimetype,
      });
    }
  };

  if (mimetype && filePath) {
    if (MIME_TYPES.IMAGE.includes(mimetype)) {
      return (
        <FileImage
          filePath={filePath}
          handleShareFile={handleShareFile(mimetype)}
          mimetype={mimetype}
          isPlayerView={isPlayerView}
        />
      );
    } else if (MIME_TYPES.AUDIO.includes(mimetype)) {
      return (
        <FileAudio
          filePath={filePath}
          handleShareFile={handleShareFile(mimetype)}
          isPlayerView={isPlayerView}
        />
      );
    } else if (MIME_TYPES.VIDEO.includes(mimetype)) {
      return (
        <FileVideo
          filePath={filePath}
          itemId={item.id}
          mimetype={mimetype}
          isPlayerView={isPlayerView}
        />
      );
    } else if (MIME_TYPES.PDF.includes(mimetype)) {
      return (
        <FilePdf
          filePath={filePath}
          itemId={item.id}
          mimetype={mimetype}
          isPlayerView={isPlayerView}
        />
      );
    }
  }
  if (filePath) {
    return (
      <FileUnsupported
        filePath={filePath}
        handleShareFile={handleShareFile(mimetype)}
        isPlayerView={isPlayerView}
      />
    );
  }
  return null;
};

export default FileItem;
