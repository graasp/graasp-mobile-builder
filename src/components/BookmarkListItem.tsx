import { useTranslation } from 'react-i18next';
import { ListItem } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DiscriminatedItem } from '@graasp/sdk';

import { useBookmark } from '../hooks/bookmark';

type Props = {
  item: DiscriminatedItem;
  onClick?: () => void;
};

function BookmarkListItem({ item, onClick }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isBookmarked, handleBookmarkPress } = useBookmark({ item });

  return (
    <ListItem
      onPress={() => {
        handleBookmarkPress();
        onClick?.();
      }}
      style={{ paddingLeft: insets.left }}
    >
      <MaterialCommunityIcons
        name={isBookmarked ? 'bookmark-minus' : 'bookmark-plus'}
        size={24}
        color="grey"
      />
      <ListItem.Content style={{ flexDirection: 'row' }}>
        <ListItem.Title style={{ flex: 2 }}>
          {isBookmarked ? t('Remove from Bookmarks') : t('Add to Bookmarks')}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
}

export default BookmarkListItem;
