import { useEffect, useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import * as Linking from 'expo-linking';

import { EmbeddedLinkItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { ItemScreenProps } from '../navigation/types';
import ChatButton from './common/ChatButton';
import FileHeaderButton from './common/FileHederButton';

const LinkItem = ({
  item,
  isPlayerView = false,
}: {
  item: EmbeddedLinkItemType;
  isPlayerView?: boolean;
}) => {
  const ref = useRef<WebView | null>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
  const uri = item.extra.embeddedLink?.url;

  useEffect(() => {
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <ChatButton item={item} />
            <FileHeaderButton name="open-in-new" handler={handleOpenLink} />
          </View>
        ),
      });
    }
  }, [isPlayerView]);

  const handleOpenLink = async () => {
    return await Linking.openURL(uri);
  };

  return (
    <WebView
      ref={(r) => (ref.current = r)}
      source={{ uri }}
      scalesPageToFit={false}
      startInLoadingState={true}
      overScrollMode="never"
      cacheEnabled={true}
      style={{
        width: dimensions.width - insets.left,
        height: '100%',
        marginLeft: insets.left,
        marginRight: insets.right,
      }}
    />
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
  },
});

export default LinkItem;
