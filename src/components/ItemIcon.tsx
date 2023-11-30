import { FC } from 'react';
import { Image } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import {
  DiscriminatedItem,
  EmbeddedLinkItemExtra,
  ItemType,
  MimeTypes,
  S3FileItemExtra,
  getEmbeddedLinkExtra,
  getS3FileExtra,
} from '@graasp/sdk';

import { ITEMS_TABLE_ROW_ICON_COLOR } from '../config/constants/constants';

interface ItemIconProps {
  type: DiscriminatedItem['type'];
  extra: DiscriminatedItem['extra'];
  size?: number;
  style?: any;
}

// TODO: use graasp-ui
const ItemIcon: FC<ItemIconProps> = ({ type, extra, size = 20, style }) => {
  if (type === ItemType.LINK) {
    const icon = getEmbeddedLinkExtra(extra as EmbeddedLinkItemExtra)
      ?.icons?.[0];

    if (icon) {
      return <Image style={{ width: 20, height: 20 }} source={{ uri: icon }} />;
    }
  }

  enum icons {
    INSERT_DRIVE_FILE = 'insert-drive-file',
    FOLDER = 'folder',
    IMAGE = 'image',
    MOVIE = 'movie',
    MUSIC_NOTE = 'music-note',
    PICTURE_AS_PDF = 'picture-as-pdf',
    INSERT_LINK = 'insert-link',
    APPS = 'apps',
    DESCRIPTION = 'description',
  }

  let Icon = icons.INSERT_DRIVE_FILE;
  switch (type) {
    case ItemType.FOLDER:
      Icon = icons.FOLDER;
      break;
    case ItemType.LOCAL_FILE:
    case ItemType.S3_FILE: {
      const mimetype = getS3FileExtra(extra as S3FileItemExtra)?.mimetype;
      if (MimeTypes.isImage(mimetype)) {
        Icon = icons.IMAGE;
        break;
      }
      if (MimeTypes.isVideo(mimetype)) {
        Icon = icons.MOVIE;
        break;
      }
      if (MimeTypes.isAudio(mimetype)) {
        Icon = icons.MUSIC_NOTE;
        break;
      }
      if (MimeTypes.isPdf(mimetype)) {
        Icon = icons.PICTURE_AS_PDF;
        break;
      }
      Icon = icons.INSERT_DRIVE_FILE;
      break;
    }
    case ItemType.LINK: {
      Icon = icons.INSERT_LINK;
      break;
    }
    case ItemType.APP: {
      Icon = icons.APPS;
      break;
    }
    case ItemType.DOCUMENT: {
      Icon = icons.DESCRIPTION;
      break;
    }
    default:
      break;
  }
  return (
    <MaterialIcons
      name={Icon}
      color={ITEMS_TABLE_ROW_ICON_COLOR}
      size={size}
      style={style}
    />
  );
};

export default ItemIcon;
