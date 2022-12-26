import React, { FC } from 'react';
import { useWindowDimensions, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { buildGraaspAssetsPdfViewerRoute } from '../api/routes';

interface FilePdfPlayerProps {
  filePath: string;
}

const FilePdfPlayer: FC<FilePdfPlayerProps> = ({ filePath }) => {
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('window').height * 0.8;

  return (
    <WebView
      source={{ uri: buildGraaspAssetsPdfViewerRoute(filePath) }}
      scalesPageToFit={false}
      startInLoadingState={true}
      overScrollMode="never"
      cacheMode="LOAD_CACHE_ELSE_NETWORK"
      cacheEnabled={false}
      style={{
        width: dimensions.width - insets.left,
        height,
        marginLeft: insets.left,
        marginBottom: insets.bottom,
      }}
      scrollEnabled={false}
    />
  );
};

export default FilePdfPlayer;
