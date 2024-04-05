import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { useRoute } from '@react-navigation/native';

import { MAP_SCREEN } from '../../e2e/constants/testIds';
import { API_HOST, BUILDER_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { ItemScreenProps } from '../navigation/types';

const MapViewScreen = () => {
  const { userToken } = useAuth();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const route = useRoute<ItemScreenProps<'ItemStackPlayerFolder'>['route']>();
  const { itemId } = route.params;

  const url = new URL(
    `${API_HOST}/m/auth/web?token=${userToken}&url=${BUILDER_HOST}/map`,
  );
  if (itemId) {
    url.searchParams.set('parentId', itemId);
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
