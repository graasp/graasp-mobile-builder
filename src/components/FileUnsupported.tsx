import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';

interface FileImageProps {
  localPath: string;
  handleSaveFile: () => void;
}

const FileImage: FC<FileImageProps> = ({ handleSaveFile }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: '#5050d2' }}
          icon={<MaterialIcons name={'ios-share'} color="#ffffff" size={25} />}
          onPress={handleSaveFile}
        ></Button>
      ),
    });
  }, []);

  return (
    <Button
      title="Save file"
      raised={true}
      buttonStyle={{ backgroundColor: '#5050d2' }}
      onPress={handleSaveFile}
      icon={
        <MaterialIcons
          name={'save'}
          color="#ffffff"
          size={20}
          style={{ paddingRight: 3 }}
        />
      }
    ></Button>
  );
};

export default FileImage;
