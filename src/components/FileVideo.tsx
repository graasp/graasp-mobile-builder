import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import * as Sharing from 'expo-sharing';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { UUID } from '../types';
import { downloadFileFromS3Url, saveMedia } from '../utils/functions/media';

interface FileVideoProps {
  filePath: string;
  itemId: UUID;
  mimetype: string;
}

const FileVideo: FC<FileVideoProps> = ({ filePath, itemId, mimetype }) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const video = React.useRef(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const handleSaveFileFromS3Url = async () => {
    if (filePath) {
      setIsDownloading(true);
      const localPath = await downloadFileFromS3Url(filePath, itemId, mimetype);
      setIsDownloading(false);
      saveMedia(localPath);
    }
  };

  const handleShareFileFromS3Url = async () => {
    if (filePath) {
      setIsDownloading(true);
      const localPath = await downloadFileFromS3Url(filePath, itemId, mimetype);
      setIsDownloading(false);
      Sharing.shareAsync(localPath);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View>
          {isDownloading ? (
            <View style={styles.headerButtonsDownloadingState}>
              <Button
                disabled
                disabledStyle={{ backgroundColor: '#5050d2' }}
                buttonStyle={{ backgroundColor: '#5050d2' }}
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
                buttonStyle={{ backgroundColor: '#5050d2' }}
                icon={
                  <MaterialIcons name={'save-alt'} color="#ffffff" size={25} />
                }
                onPress={handleSaveFileFromS3Url}
              ></Button>
              <Button
                buttonStyle={{ backgroundColor: '#5050d2' }}
                icon={
                  <MaterialIcons name={'ios-share'} color="#ffffff" size={25} />
                }
                onPress={handleShareFileFromS3Url}
              ></Button>
            </View>
          )}
        </View>
      ),
    });
  }, [isDownloading]);

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
          height: '100%',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
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
