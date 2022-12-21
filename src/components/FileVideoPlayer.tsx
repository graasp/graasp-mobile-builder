import { Video, ResizeMode } from 'expo-av';
import React, { FC } from 'react';
import {
  Dimensions,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FileVideoPlayerProps {
  filePath: string;
}

const FileVideoPlayer: FC<FileVideoPlayerProps> = ({ filePath }) => {
  const video = React.useRef(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const height = Dimensions.get('window').height * 0.8;

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
          height,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FileVideoPlayer;
