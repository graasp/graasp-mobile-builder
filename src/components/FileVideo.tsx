import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import React, { FC, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';

interface FileVideoProps {
  localPath: string;
  handleSaveFile: () => void;
}

const FileVideo: FC<FileVideoProps> = ({ localPath, handleSaveFile }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const video = React.useRef(null);
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: '#5050d2' }}
          icon={
            <MaterialIcons
              name={'ios-share'}
              color="#ffffff"
              size={25}
              style={{ paddingRight: 3 }}
            />
          }
          onPress={handleSaveFile}
        ></Button>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        source={{
          uri: localPath,
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
});

export default FileVideo;
