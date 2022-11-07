import React, { FC } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import {
  getEmbeddedLinkExtra,
  getS3FileExtra,
} from '../utils/functions/itemExtra';

import { Image } from 'react-native';

import { ITEM_TYPES, ITEMS_TABLE_ROW_ICON_COLOR, MIME_TYPES } from '../config/constants/constants';
import { ItemType, UnknownExtra } from '@graasp/sdk';

interface ItemIconProps {
  name: string;
  type: ItemType;
  extra: UnknownExtra;
  size?: number;
  style?: any;
}

const ItemIcon: FC<ItemIconProps> = ({ name, type, extra, size = 20, style }) => {
  const mimetype = getS3FileExtra(extra)?.mimetype;
  const icon = getEmbeddedLinkExtra(extra)?.icons?.[0];

  if (icon) {
    return <Image style={{ width: 20, height: 20 }} source={{ uri: icon }} />;
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
    DESCRIPTION = 'description'
  };

  let Icon = icons.INSERT_DRIVE_FILE;
  switch (type) {
    case ITEM_TYPES.FOLDER:
      Icon = icons.FOLDER;
      break;
    case ITEM_TYPES.FILE:
    case ITEM_TYPES.S3_FILE: {
      if (MIME_TYPES.IMAGE.includes(mimetype)) {
        Icon = icons.IMAGE;
        break;
      }
      if (MIME_TYPES.VIDEO.includes(mimetype)) {
        Icon = icons.MOVIE;
        break;
      }
      if (MIME_TYPES.AUDIO.includes(mimetype)) {
        Icon = icons.MUSIC_NOTE;
        break;
      }
      if (MIME_TYPES.PDF.includes(mimetype)) {
        Icon = icons.PICTURE_AS_PDF;
        break;
      }
      Icon = icons.INSERT_DRIVE_FILE;
      break;
    }
    case ITEM_TYPES.LINK: {
      Icon = icons.INSERT_LINK;
      break;
    }
    case ITEM_TYPES.APP: {
      Icon = icons.APPS;
      break;
    }
    case ITEM_TYPES.DOCUMENT: {
      Icon = icons.DESCRIPTION;
      break;
    }
    default:
      break;
  }
  return <MaterialIcons name={Icon} color={ITEMS_TABLE_ROW_ICON_COLOR} size={size} style={style} />;
};

export default ItemIcon;
