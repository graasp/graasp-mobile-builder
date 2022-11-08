import env from '../../env.json';

const { API_HOST, S3_FILES_HOST } = env;

export { API_HOST, S3_FILES_HOST };

export const APP_NAME = 'Graasp';

export const DESCRIPTION_MAX_LENGTH = 30;

export const DEFAULT_IMAGE_SRC =
  'https://pbs.twimg.com/profile_images/1300707321262346240/IsQAyu7q_400x400.jpg';

export const ROOT_ID = 'root-id';

export const TREE_PREVENT_SELECTION = {
  NONE: 'none',
  SELF_AND_CHILDREN: 'selfAndChildren',
};

export const TREE_VIEW_MAX_WIDTH = 400;
export const UUID_LENGTH = 36;

export const ITEM_TYPES = {
  FOLDER: 'folder',
  FILE: 'file',
  S3_FILE: 's3File',
  LINK: 'embeddedLink',
  SHORTCUT: 'shortcut',
  DOCUMENT: 'document',
  APP: 'app',
};
export const MIME_TYPES = {
  IMAGE: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'],
  VIDEO: ['video/mp4'],
  AUDIO: ['audio/mpeg', 'audio/mp3'],
  PDF: ['application/pdf'],
};
export const DRAWER_WIDTH = 300;
export const DEFAULT_LOCALE = 'en-US';

export const PERMISSION_LEVELS = {
  WRITE: 'write',
  READ: 'read',
  ADMIN: 'admin',
};

export const DEFAULT_PERMISSION_LEVEL = PERMISSION_LEVELS.WRITE;

export const ITEM_LAYOUT_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

export const DEFAULT_ITEM_LAYOUT_MODE = ITEM_LAYOUT_MODES.LIST;

export const ORDERING = {
  ASC: 'asc',
  DESC: 'desc',
};

export const ROWS_PER_PAGE_OPTIONS = [10, 25];

export const ITEM_DATA_TYPES = {
  DATE: 'date',
};

export const LEFT_MENU_WIDTH = 250;
export const RIGHT_MENU_WIDTH = 300;
export const HEADER_HEIGHT = 64;

export const FILE_UPLOAD_MAX_FILES = 5;
export const ITEMS_TABLE_ROW_ICON_COLOR = '#333333';
export const UPLOAD_FILES_METHODS = {
  S3: 's3',
  DEFAULT: 'default',
};

export const ITEM_ICON_MAX_SIZE = 25;

export const USERNAME_MAX_LENGTH = 30;

export const SHARE_ITEM_MODAL_MIN_WIDTH = 120;

// React Query Configs
export const STALE_TIME_MILLISECONDS = 1000 * 60;
export const CACHE_TIME_MILLISECONDS = 1000 * 60;

export const LOADING_CONTENT = '…';
export const SETTINGS = {
  ITEM_LOGIN: {
    name: 'item-login',
    OPTIONS: {
      USERNAME: 'username',
      USERNAME_AND_PASSWORD: 'username+password',
    },
    SIGN_IN_MODE: {
      PSEUDONYME: 'pseudonyme',
      MEMBER_ID: 'memberId',
    },
  },
  ITEM_PUBLIC: {
    name: 'public-item',
  },
  ITEM_PUBLISHED: {
    name: 'published-item',
  },
  // this tag doesn't exist but is used if none of the visiblity tag is set
  ITEM_PRIVATE: {
    name: 'private-item',
  },
};

export const SETTINGS_ITEM_LOGIN_DEFAULT = SETTINGS.ITEM_LOGIN.OPTIONS.USERNAME;
/*export const SETTINGS_ITEM_LOGIN_SIGN_IN_MODE_DEFAULT =
  SETTINGS.ITEM_LOGIN.SIGN_IN_MODE.USERNAME;*/

export const REDIRECT_URL_LOCAL_STORAGE_KEY = 'redirectUrl';

export const USER_ITEM_ORDER = 'user_order';

export const COMPOSE_VIEW_SELECTION = 'composeViewSelection';
export const PERFORM_VIEW_SELECTION = 'performViewSelection';

export const ITEM_TYPES_WITH_CAPTIONS = [
  ITEM_TYPES.S3_FILE,
  ITEM_TYPES.FILE,
  ITEM_TYPES.APP,
  ITEM_TYPES.LINK,
  ITEM_TYPES.DOCUMENT,
];

export const MIN_SCREEN_WIDTH = 1000;
export const SHARE_MODAL_AVATAR_GROUP_MAX_AVATAR = 8;

export const FLAG_LIST_MAX_HEIGHT = 250;

export const SHARE_LINK_COLOR = 'black';
export const SHARE_LINK_CONTAINER_BORDER_WIDTH = 1;
export const SHARE_LINK_CONTAINER_BORDER_STYLE = 'dotted';

/* possible choices for number of items per page in grid,
   (must be common multiple for possible row counts of 1,2,3,4,6) */
export const GRID_ITEMS_PER_PAGE_CHOICES = [12, 24, 36, 48];

export const ITEM_DEFAULT_HEIGHT = 500;
export const GRAASP_LOGO_HEADER_HEIGHT = 40;

export const PSEUDONIMIZED_USER_MAIL = '@graasp.org';
export const ITEMS_TABLE_CONTAINER_HEIGHT = '60vh';

export const DRAG_ICON_SIZE = 18;

export const ACTION_CELL_WIDTH = 230;

export enum LOGIN_TYPE {
  EMAIL_LINK = 'emailLink',
  EMAIL_PASSWORD = 'emailPassword',
}

export enum SECURE_STORE_VALUES {
  AUTH_TOKEN = 'userToken',
  REFRESH_TOKEN = 'refreshToken',
  NONCE = 'nonce',
}

export enum AuthActionKind {
  RESTORE_TOKEN = 'RESTORE_TOKEN',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
}

export const SHARE_OPTIONS = {
  COMPOSE: 1,
  PERFORM: 2,
};

export const SHARE_HOST = {
  COMPOSE: 'https://builder.graasp.org/items',
  PERFORM: 'https://player.graasp.org',
};
