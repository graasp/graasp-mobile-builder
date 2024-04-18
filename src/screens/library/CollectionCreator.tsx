import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';

import { DiscriminatedItem } from '@graasp/sdk';

import { useQueryClient } from '../../context/QueryClientContext';

export const DEFAULT_MEMBER_THUMBNAIL = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 -2 24 22" stroke-width="1.5" stroke="none" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>`)}`;

type Props = {
  item: DiscriminatedItem;
};

function CollectionCreator({ item }: Props) {
  const { hooks } = useQueryClient();
  const { data: avatar } = hooks.useAvatarUrl({
    id: item.creator?.id,
    size: 'small',
  });

  const creatorName = item.creator?.name ?? 'Unknown';

  return (
    <View style={styles.avatarAndCreator}>
      <Avatar
        size="small"
        rounded
        title={creatorName[0]?.toUpperCase()}
        containerStyle={{ backgroundColor: 'lightgrey' }}
        {...(avatar
          ? {
              source: {
                uri: avatar,
              },
            }
          : {})}
      />
      <Text>{creatorName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarAndCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
});

export default CollectionCreator;
