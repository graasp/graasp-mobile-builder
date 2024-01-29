import { FC, useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import * as Sharing from 'expo-sharing';

import { DiscriminatedItem, UUID, buildPdfViewerLink } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { PDF_ITEM, PDF_SHARE } from '../../e2e/constants/testIds';
import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { GRAASP_ASSETS_URL } from '../config/env';
import { ItemScreenProps } from '../navigation/types';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { downloadFileFromS3Url } from '../utils/functions/media';
import ChatButton from './common/ChatButton';
import FileHeaderButton from './common/FileHederButton';

interface FilePdfProps {
  filePath: string;
  itemId: UUID;
  mimetype: string;
  isPlayerView: boolean;
  item: DiscriminatedItem;
}

const FilePdf: FC<FilePdfProps> = ({
  filePath,
  itemId,
  mimetype,
  isPlayerView,
  item,
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('window').height * 0.8;

  const handleShareFileFromS3Url = async () => {
    if (filePath) {
      setIsDownloading(true);
      const localPath = await downloadFileFromS3Url(filePath, itemId, mimetype);
      setIsDownloading(false);
      Sharing.shareAsync(localPath);
      await customAnalyticsEvent(ANALYTICS_EVENTS.SHARE_ITEM, {
        item_type: mimetype,
      });
    }
  };

  useEffect(() => {
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <ChatButton item={item} />
            {isDownloading ? (
              <FileHeaderButton disabled={true} name="cloud-download" />
            ) : (
              <FileHeaderButton
                name="ios-share"
                handler={handleShareFileFromS3Url}
                testID={PDF_SHARE}
              />
            )}
          </View>
        ),
      });
    }
  }, [isDownloading, isPlayerView]);

  return (
    <WebView
      source={{
        uri:
          buildPdfViewerLink(GRAASP_ASSETS_URL) + encodeURIComponent(filePath),
      }}
      scalesPageToFit={false}
      startInLoadingState={true}
      overScrollMode="never"
      cacheMode="LOAD_DEFAULT"
      cacheEnabled={false}
      style={{
        width: dimensions.width - insets.left,
        height,
        marginLeft: insets.left,
        marginBottom: insets.bottom,
      }}
      scrollEnabled={false}
      testID={PDF_ITEM}
    />
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
  },

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default FilePdf;
