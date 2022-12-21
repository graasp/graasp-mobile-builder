import React, { FC } from 'react';
import { useWindowDimensions } from 'react-native';
import { Text } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { ITEM_TYPES } from '../config/constants/constants';
import { Item } from '../types';
import Document from './Document';
import FileItem from './FileItem';

interface PlayerItemProps {
  item: Item;
}

const PlayerItem: FC<PlayerItemProps> = ({ item }) => {
  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();

  switch (item.type) {
    case ITEM_TYPES.DOCUMENT: {
      const content = item.extra.document?.content;
      return <Document content={content} />;
    }
    case ITEM_TYPES.APP: {
      const url = item.extra.app?.url;
      console.log('The url :    ', url);
      return (
        <WebView
          source={{ uri: url }}
          scalesPageToFit={false}
          startInLoadingState={true}
          overScrollMode="never"
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          cacheEnabled={true}
          style={{
            width: dimensions.width - insets.left,
            height: 400,
            marginLeft: insets.left,
            marginBottom: insets.bottom,
          }}
        />
      );
    }
    case ITEM_TYPES.LINK: {
      const uri = item.extra.embeddedLink?.url;
      return (
        <WebView
          source={{ uri }}
          scalesPageToFit={false}
          startInLoadingState={true}
          overScrollMode="never"
          style={{
            width: dimensions.width - insets.left,
            height: 400,
            marginLeft: insets.left,
          }}
        />
      );
    }
    case ITEM_TYPES.S3_FILE: {
      return <FileItem item={item} isPlayerView={true} />;
    }
    default: {
      return <Text>Error</Text>;
    }
  }
};

export default PlayerItem;
