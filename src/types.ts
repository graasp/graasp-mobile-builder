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

export enum ItemType {
  APP = 'app',
  DOCUMENT = 'document',
  FOLDER = 'folder',
  LINK = 'embeddedLink',
  LOCAL_FILE = 'file',
  S3_FILE = 's3File',
  SHORTCUT = 'shortcut',
  H5P = 'h5p',
}

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  PDF = 'pdf',
  UNSUPPORTED = 'unsupported',
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

export enum MemberType {
  Individual = 'individual',
  Group = 'group',
}

export interface Actor {
  id: string;
}

export interface Member<E extends UnknownExtra = UnknownExtra> extends Actor {
  name: string;
  email: string;
  type: MemberType;
  extra: E;
  createdAt: string;
  updatedAt: string;
  password?: string;
}

export interface S3FileItemExtra extends UnknownExtra {
  s3File: S3FileItemExtraProp;
}

export type S3FileItemExtraProp = {
  mimetype: string;
  name: string;
};
