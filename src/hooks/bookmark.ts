import { useEffect, useState } from 'react';

import { DiscriminatedItem } from '@graasp/sdk';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useQueryClient } from '../context/QueryClientContext';
import { buildBookmarkKey } from '../utils/bookmark';

export const useBookmark = ({ item }: { item: DiscriminatedItem }) => {
  const { hooks, mutations } = useQueryClient();
  const { data: currentMember } = hooks.useCurrentMember();
  const { data: bookmarkedItems } = hooks.useFavoriteItems();
  const { mutateAsync: addToFavorite } = mutations.useAddFavoriteItem();
  const { mutateAsync: removeToFavorite } = mutations.useRemoveFavoriteItem();

  /**
   * whether the item is bookmarked locally
   */
  const [isLocalBookmarked, setIsLocalBookmarked] = useState(false);
  /**
   * whether the item is bookmarked locally or remotely
   */
  const [isBookmarked, setIsBookmarked] = useState(false);

  const key = buildBookmarkKey(item.id);

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          setIsLocalBookmarked(true);
        }
      } catch (e) {
        // error reading value
        console.error(e);
      }
    })();
  }, [item]);

  useEffect(() => {
    const isOnlineBookmarked = bookmarkedItems?.some(
      ({ item: { id } }) => id === item.id,
    );
    setIsBookmarked(isLocalBookmarked || isOnlineBookmarked || false);
  }, [isLocalBookmarked, bookmarkedItems]);

  const handleBookmarkPress = async () => {
    // remove from bookmarks
    if (isBookmarked) {
      // local bookmark
      if (isLocalBookmarked) {
        try {
          AsyncStorage.removeItem(key);
          // optimistic mutation
          return setIsLocalBookmarked(false);
        } catch (e) {
          // rollback
          setIsLocalBookmarked(true);
          // saving error
          console.error(e);
        }
      } else {
        return removeToFavorite(item.id);
      }
    }

    // add to bookmarks
    // online bookmark
    if (currentMember) {
      addToFavorite(item.id);
    } else {
      try {
        // value does not matter
        AsyncStorage.setItem(key, JSON.stringify({ isBookmarked: true }));
        // optimistic mutation
        return setIsLocalBookmarked(true);
      } catch (e) {
        // rollback
        setIsLocalBookmarked(false);
        // saving error
        console.error(e);
      }
    }
  };

  return {
    handleBookmarkPress,
    isLocalBookmarked,
    setIsLocalBookmarked,
    isBookmarked,
    setIsBookmarked,
  };
};
