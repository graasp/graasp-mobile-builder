import { ItemType } from '@graasp/sdk';

export type UUID = string;

export type ItemTag = {
  id: UUID;
  path: string;
  tagId: UUID;
};

export type Tag = {
  id: UUID;
  name: string;
};

export declare type Anything =
  | string
  | number
  | boolean
  | null
  | undefined
  | Anything[]
  | {
      [key: string]: Anything;
    };

export interface UnknownExtra {
  [key: string]: any;
}

export interface Serializable {
  [key: string]: Anything;
}

export interface ItemSettings extends Serializable {
  isPinned?: boolean;
  showChatBox?: boolean;
  hasThumbnail?: boolean;
}

export interface Item<T extends UnknownExtra = UnknownExtra, S = ItemSettings> {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  path: string;
  extra: T;
  settings: S;
  creator: string;
  createdAt: string;
  updatedAt: string;
}

export interface S3FileItemExtra extends UnknownExtra {
  s3File: S3FileItemExtraProp;
}

export type S3FileItemExtraProp = {
  mimetype: string;
  name: string;
};
