import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import * as Location from 'expo-location';

import { Context } from '@graasp/sdk';

import { useNavigation, useRoute } from '@react-navigation/native';

import { MAP_SCREEN } from '../../e2e/constants/testIds';
import { API_HOST, BUILDER_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { ITEM_NAVIGATOR, ITEM_NAVIGATOR_ITEM } from '../navigation/names';
import { ItemScreenProps } from '../navigation/types';
import { useNavigateToPlayer } from '../navigation/useNavigateToPlayer';

// debug code does not work on android
let debugCode = '';
if (Platform.OS === 'ios') {
  debugCode = `
      console.log = window.ReactNativeWebView.postMessage;
      console.debug = window.ReactNativeWebView.postMessage;
      console.error = window.ReactNativeWebView.postMessage;
    `;
}

const MapViewScreen = () => {
  const { userToken } = useAuth();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigateToPlayer = useNavigateToPlayer();
  const { navigate: navigateToBuilder } =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
  const route = useRoute<ItemScreenProps<'ItemStackPlayerFolder'>['route']>();
  const { itemId } = route.params;

  const [allowLocation, setAllowLocation] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setAllowLocation(status === 'granted');
    })();
  }, []);

  const redirectionUrl = new URL(`${BUILDER_HOST}/map`);
  if (itemId) {
    redirectionUrl.searchParams.set('parentId', itemId);
  }
  if (allowLocation) {
    redirectionUrl.searchParams.set('enableGeolocation', 'true');
  }
  redirectionUrl.searchParams.set('isMobileApp', 'true');

  // go to map
  let url = redirectionUrl;

  // transform usertoken to cookie before accessing to map if user is signed in
  if (userToken) {
    url = new URL(`${API_HOST}/m/auth/web?token=${userToken}`);
    url.searchParams.set('url', redirectionUrl.toString());
  }

  return (
    <WebView
      source={{
        uri: url.toString(),
      }}
      geolocationEnabled
      testID={MAP_SCREEN}
      scalesPageToFit={false}
      startInLoadingState={true}
      overScrollMode="never"
      javaScriptEnabled={true}
      cacheEnabled={true}
      // necessary for android
      injectedJavaScript={`(function() {
                window.parent = window.ReactNativeWebView;
                ${debugCode}
            })();`}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          switch (data.action) {
            case 'open-player':
              if (data.item) {
                navigateToPlayer({
                  type: data.item.type,
                  itemId: data.item.id,
                  name: data.item.name,
                  origin: { rootId: data.item.id, context: Context.Builder },
                });
              }
              break;
            case 'open-builder':
              if (data.item) {
                navigateToBuilder(ITEM_NAVIGATOR, {
                  screen: ITEM_NAVIGATOR_ITEM,
                  params: { itemId: data.item.id, headerTitle: data.item.name },
                });
              }
              break;
            default:
              break;
          }
        } catch (e) {
          console.error(e);
        }
      }}
      style={{
        width: dimensions.width - insets.left,
        height: '100%',
        marginLeft: insets.left,
        marginRight: insets.right,
      }}
    />
  );
};

export default MapViewScreen;
