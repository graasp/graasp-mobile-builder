import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Context, DiscriminatedItem } from '@graasp/sdk';

import PlayerButton from '../../components/common/PlayerButton';
import { ITEMS_TABLE_ROW_ICON_COLOR } from '../../config/constants/constants';
import { useBookmark } from '../../hooks/bookmark';

const CollectionScreenOptions = ({ item }: { item: DiscriminatedItem }) => {
  const { isBookmarked, handleBookmarkPress } = useBookmark({ item });
  return (
    <View style={styles.container}>
      <PlayerButton
        size={28}
        itemId={item.id}
        origin={{ rootId: item.id, context: Context.Library }}
        name={item.name}
        type={item.type}
      />
      <MaterialCommunityIcons
        name={isBookmarked ? 'bookmark-minus' : 'bookmark-plus'}
        size={28}
        color={ITEMS_TABLE_ROW_ICON_COLOR}
        onPress={handleBookmarkPress}
      />
    </View>
  );
};

export default CollectionScreenOptions;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
