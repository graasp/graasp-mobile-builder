import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { useRoute } from '@react-navigation/native';

import { API_HOST, BUILDER_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { ItemScreenProps } from '../navigation/types';

const MapViewScreen = () => {
  const { userToken } = useAuth();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const route = useRoute<ItemScreenProps<'ItemStackPlayerFolder'>['route']>();
  const { itemId } = route.params;

  return (
    <WebView
      source={{
        uri: `${API_HOST}/m/auth/web?t=${userToken}&url=${BUILDER_HOST}/map?parentId=${itemId}`,
      }}
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
