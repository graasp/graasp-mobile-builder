import { useEffect, useState } from 'react';

import { DiscriminatedItem } from '@graasp/sdk';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useQueryClient } from '../context/QueryClientContext';
import { buildBookmarkKey } from '../utils/bookmark';

export const useBookmark = ({ item }: { item: DiscriminatedItem }) => {
  const { hooks, mutations } = useQueryClient();
  const { data: currentMember } = hooks.useCurrentMember();
  const { data: favoriteItems } = hooks.useFavoriteItems();
  const { mutate: addToFavorite } = mutations.useAddFavoriteItem();
  const { mutate: removeToFavorite } = mutations.useRemoveFavoriteItem();

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
    const isOnlineBookmarked = favoriteItems?.some(
      ({ item: { id } }) => id === item.id,
    );
    setIsBookmarked(isLocalBookmarked || isOnlineBookmarked || false);
  }, [isLocalBookmarked, favoriteItems]);

  const handleBookmarkPress = async () => {
    if (isBookmarked) {
      if (isLocalBookmarked) {
        try {
          return await AsyncStorage.removeItem(key);
        } catch (e) {
          // saving error
          console.error(e);
        }
      } else {
        return removeToFavorite(item.id);
      }
    }

    // online bookmark
    if (currentMember) {
      addToFavorite(item.id);
    } else {
      try {
        // value does not matter
        await AsyncStorage.setItem(key, JSON.stringify({ isBookmarked: true }));
      } catch (e) {
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
