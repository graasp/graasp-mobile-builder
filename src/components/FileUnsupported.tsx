import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { FileType } from '../types';

interface FileImageProps {
  filePath: string;
  handleShareFile: (itemType: FileType) => void;
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
          onPress={() => handleShareFile(FileType.UNSUPPORTED)}
        ></Button>
      ),
    });
  }, []);

  return (
    <Button
      title={t('Save file')!}
      raised={true}
      buttonStyle={{ backgroundColor: '#5050d2' }}
      onPress={() => handleShareFile(FileType.UNSUPPORTED)}
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
