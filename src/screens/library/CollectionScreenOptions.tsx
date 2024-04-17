import { View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Context, DiscriminatedItem } from '@graasp/sdk';

import { COLLECTION_BOOKMARK_BUTTON } from '../../../e2e/constants/testIds';
import PlayerButton from '../../components/common/PlayerButton';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../../config/constants/constants';
import { useBookmark } from '../../hooks/bookmark';

const CollectionScreenOptions = ({ item }: { item: DiscriminatedItem }) => {
  const { isBookmarked, handleBookmarkPress } = useBookmark({ item });
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PlayerButton
        size={28}
        itemId={item.id}
        origin={{ rootId: item.id, context: Context.Library }}
        name={item.name}
        type={item.type}
      />
      <MaterialCommunityIcons
        testID={COLLECTION_BOOKMARK_BUTTON}
        name={isBookmarked ? 'bookmark-minus' : 'bookmark-plus'}
        size={28}
        color={ITEMS_TABLE_ROW_ICON_COLOR}
        onPress={handleBookmarkPress}
      />
    </View>
  );
};

export default CollectionScreenOptions;
