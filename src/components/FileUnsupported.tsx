import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../config/constants/constants';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';

interface FileImageProps {
  filePath: string;
  handleShareFile: () => Promise<void>;
}

const FileImage: FC<FileImageProps> = ({ handleShareFile }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          icon={<MaterialIcons name={'ios-share'} color="#ffffff" size={25} />}
          onPress={() => handleShareFile()}
        ></Button>
      ),
    });
  }, []);

  return (
    <Button
      title={t('Save file')!}
      raised={true}
      buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
      onPress={() => handleShareFile()}
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
