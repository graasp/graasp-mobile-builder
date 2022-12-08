import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';

interface FileImageProps {
  localPath: string;
  handleSaveFile: () => void;
}

const FileImage: FC<FileImageProps> = ({ localPath, handleSaveFile }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();

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
});

export default FileImage;
