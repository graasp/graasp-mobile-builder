import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DiscriminatedItem } from '@graasp/sdk';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useQueryClient } from '../context/QueryClientContext';
import { buildBookmarkKey } from '../utils/bookmark';

type Props = {
  item: DiscriminatedItem;
};

function BookmarkListItem({ item }: Props) {
  const { t } = useTranslation();
  const { hooks, mutations } = useQueryClient();
  const { data: currentMember } = hooks.useCurrentMember();
  const { data: favoriteItems } = hooks.useFavoriteItems();
  const insets = useSafeAreaInsets();
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

  const handleBookmarkPress = async ({
    itemId,
  }: {
    itemId: DiscriminatedItem['id'];
  }) => {
    if (isBookmarked) {
      if (isLocalBookmarked) {
        try {
          return await AsyncStorage.removeItem(key);
        } catch (e) {
          // saving error
          console.error(e);
        }
      } else {
        return removeToFavorite(itemId);
      }
    }

    // online bookmark
    if (currentMember) {
      addToFavorite(itemId);
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

  return (
    <ListItem
      onPress={() => handleBookmarkPress({ itemId: item.id })}
      style={{ paddingLeft: insets.left }}
    >
      <MaterialCommunityIcons
        name={isBookmarked ? 'bookmark-minus' : 'bookmark-plus'}
        size={24}
        color="grey"
      />
      <ListItem.Content style={{ flexDirection: 'row' }}>
        <ListItem.Title style={{ flex: 2 }}>
          {isBookmarked ? t('Remove from Bookmarks') : t('Bookmark')}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
}

export default BookmarkListItem;
