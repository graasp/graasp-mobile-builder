import { useEffect, useRef } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { EmbeddedLinkItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { CHAT_BUTTON_HEADER } from '../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../config/constants/constants';
import { handleOpenChat } from '../utils/functions/chat';
import FileHeaderButton from './common/FileHederButton';
import { ItemScreenProps } from '../navigation/types';

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
  const navigation = useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
  const uri = item.extra.embeddedLink?.url;

  useEffect(() => {
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <FileHeaderButton
              name="chat"
              handler={() => handleOpenChat(navigation, item)}
              testID={CHAT_BUTTON_HEADER}
            />
            <Button
              buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
              icon={
                <Ionicons name={'open-outline'} color="#ffffff" size={25} />
              }
              onPress={() => Linking.openURL(uri)}
            ></Button>
          </View>
        ),
      });
    }
  }, [isPlayerView]);

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
    width: 82,
  },
});

export default LinkItem;
