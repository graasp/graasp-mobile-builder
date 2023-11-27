import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaterialIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import * as Sharing from 'expo-sharing';

import { UUID } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import {
  VIDEO_ITEM,
  VIDEO_SAVE,
  VIDEO_SHARE,
} from '../../e2e/constants/testIds';
import { ANALYTICS_EVENTS, PRIMARY_COLOR } from '../config/constants/constants';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { downloadFileFromS3Url, saveMedia } from '../utils/functions/media';

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
                <Button
                  disabled
                  disabledStyle={{ backgroundColor: PRIMARY_COLOR }}
                  buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
                  icon={
                    <MaterialIcons
                      name={'cloud-download'}
                      color="#ffffff"
                      size={25}
                    />
                  }
                ></Button>
              </View>
            ) : (
              <View style={styles.headerButtons}>
                <Button
                  buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
                  icon={
                    <MaterialIcons
                      name={'save-alt'}
                      color="#ffffff"
                      size={25}
                    />
                  }
                  onPress={handleSaveFileFromS3Url}
                ></Button>
                <Button
                  buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
                  icon={
                    <MaterialIcons
                      name={'ios-share'}
                      color="#ffffff"
                      size={25}
                    />
                  }
                  onPress={handleShareFileFromS3Url}
                ></Button>
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
