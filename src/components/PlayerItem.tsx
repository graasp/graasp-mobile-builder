import { FC } from 'react';
import { Text } from 'react-native-elements';

import { Context, DiscriminatedItem, ItemType } from '@graasp/sdk';

import AppItem from './AppItem';
import Document from './Document';
import FileItem from './FileItem';
import LinkItem from './LinkItem';

interface PlayerItemProps {
  item: DiscriminatedItem;
}

const PlayerItem: FC<PlayerItemProps> = ({ item }) => {
  switch (item.type) {
    case ItemType.DOCUMENT: {
      const content = item.extra.document?.content;
      return <Document content={content} />;
    }
    case ItemType.APP: {
      return <AppItem item={item} context={Context.Player} />;
    }
    case ItemType.LINK: {
      return <LinkItem item={item} isPlayerView={true} />;
    }
    case ItemType.S3_FILE: {
      return <FileItem item={item} isPlayerView={true} />;
    }
    default: {
      return <Text>Error</Text>;
    }
  }
};

export default PlayerItem;
