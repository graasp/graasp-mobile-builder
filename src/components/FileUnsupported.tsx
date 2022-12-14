import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-elements';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';

interface FileImageProps {
  filePath: string;
  handleShareFile: () => void;
}

const FileImage: FC<FileImageProps> = ({ handleShareFile }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: '#5050d2' }}
          icon={<MaterialIcons name={'ios-share'} color="#ffffff" size={25} />}
          onPress={handleShareFile}
        ></Button>
      ),
    });
  }, []);

  return (
    <Button
      title={t('Save file')!}
      raised={true}
      buttonStyle={{ backgroundColor: '#5050d2' }}
      onPress={handleShareFile}
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
