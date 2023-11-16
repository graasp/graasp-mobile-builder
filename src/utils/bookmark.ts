import { DiscriminatedItem } from '@graasp/sdk';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARK_PREFIX = 'bookmark-';

export const buildBookmarkKey = (id: DiscriminatedItem['id']) =>
  BOOKMARK_PREFIX + id;

export const getLocalBookmarkedItemIds = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const bookmarkKeys = keys.filter((key) => key.includes(BOOKMARK_PREFIX));
  return bookmarkKeys.map((key) => key.slice(BOOKMARK_PREFIX.length));
};
