import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { Context } from '@graasp/sdk';

import { useRoute } from '@react-navigation/native';

import { MAP_SCREEN } from '../../e2e/constants/testIds';
import { API_HOST, BUILDER_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { useNavigateToPlayer } from '../navigation/ItemStackNavigator';
import { ItemScreenProps } from '../navigation/types';

const MapViewScreen = () => {
  const { userToken } = useAuth();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigateToPlayer = useNavigateToPlayer();
  const route = useRoute<ItemScreenProps<'ItemStackPlayerFolder'>['route']>();
  const { itemId } = route.params;

  const redirectionUrl = new URL(`${BUILDER_HOST}/map`);
  if (itemId) {
    redirectionUrl.searchParams.set('parentId', itemId);
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
      testID={MAP_SCREEN}
      scalesPageToFit={false}
      startInLoadingState={true}
      overScrollMode="never"
      javaScriptEnabled={true}
      cacheEnabled={true}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        navigateToPlayer({
          type: data.item.type,
          itemId: data.item.id,
          name: data.item.name,
          origin: { rootId: itemId, context: Context.Builder },
        });
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
