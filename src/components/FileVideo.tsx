import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ResizeMode, Video } from 'expo-av';
import * as Sharing from 'expo-sharing';

import { UUID } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import {
  VIDEO_ITEM,
  VIDEO_SAVE,
  VIDEO_SHARE,
} from '../../e2e/constants/testIds';
import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { downloadFileFromS3Url, saveMedia } from '../utils/functions/media';
import FileHeaderButton from './common/FileHederButton';

interface FileVideoProps {
  filePath: string;
  itemId: UUID;
  mimetype: string;
  isPlayerView: boolean;
}

const FileVideo: FC<FileVideoProps> = ({
  filePath,
  itemId,
  mimetype,
  isPlayerView,
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const video = useRef(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('window').height * 0.8;
  const { t } = useTranslation();

  const handleSaveFileFromS3Url = async () => {
    if (filePath) {
      setIsDownloading(true);
      const localPath = await downloadFileFromS3Url(filePath, itemId, mimetype);
      setIsDownloading(false);
      saveMedia(localPath, t);
      await customAnalyticsEvent(ANALYTICS_EVENTS.SAVE_ITEM, {
        item_type: mimetype,
      });
    }
  };

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
          <View>
            {isDownloading ? (
              <View style={styles.headerButtonsDownloadingState}>
                <FileHeaderButton disabled={true} name="cloud-download" />
              </View>
            ) : (
              <View style={styles.headerButtons}>
                <FileHeaderButton
                  name="save-alt"
                  handler={handleSaveFileFromS3Url}
                  testID={VIDEO_SAVE}
                />
                <FileHeaderButton
                  name="ios-share"
                  handler={handleShareFileFromS3Url}
                  testID={VIDEO_SHARE}
                />
              </View>
            )}
          </View>
        ),
      });
    }
  }, [isDownloading, isPlayerView]);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={{
          uri: filePath,
        }}
        style={{
          alignSelf: 'center',
          width: dimensions.width - insets.left,
          height: isPlayerView ? height : '100%',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        testID={VIDEO_ITEM}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    width: 82,
  },
  headerButtonsDownloadingState: {
    flexDirection: 'row',
    width: 41,
  },
});

export default FileVideo;
