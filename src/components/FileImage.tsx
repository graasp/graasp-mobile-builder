import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Button } from 'react-native-elements';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { saveMedia } from '../utils/functions/media';

interface FileImageProps {
  localPath: string;
  handleSaveFile: () => void;
}

const FileImage: FC<FileImageProps> = ({ localPath, handleSaveFile }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();

  const handleSaveImage = () => {
    saveMedia(localPath);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <Button
            buttonStyle={{ backgroundColor: '#5050d2' }}
            icon={<MaterialIcons name={'save-alt'} color="#ffffff" size={25} />}
            onPress={handleSaveImage}
          ></Button>
          <Button
            buttonStyle={{ backgroundColor: '#5050d2' }}
            icon={
              <MaterialIcons name={'ios-share'} color="#ffffff" size={25} />
            }
            onPress={handleSaveFile}
          ></Button>
        </View>
      ),
    });
  }, []);

  return (
    <Image
      resizeMode="contain"
      style={styles.image}
      source={{
        uri: localPath,
      }}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  headerButtons: {
    flexDirection: 'row',
    width: 82,
  },
});

export default FileImage;
