import { useEffect, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { EmbeddedLinkItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../config/constants/constants';

const LinkItem = ({ item }: { item: EmbeddedLinkItemType }) => {
  const ref = useRef<WebView | null>(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const uri = item.extra.embeddedLink?.url;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          icon={<Ionicons name={'open-outline'} color="#ffffff" size={25} />}
          onPress={() => Linking.openURL(uri)}
        ></Button>
      ),
    });
  }, []);
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
export default LinkItem;
