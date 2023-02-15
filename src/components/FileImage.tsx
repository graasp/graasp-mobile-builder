import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Image, View } from 'react-native';
import { Button } from 'react-native-elements';

import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { FileType } from '../types';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { saveMedia } from '../utils/functions/media';

interface FileImageProps {
  filePath: string;
  handleShareFile: (itemType: FileType) => void;
}

const FileImage: FC<FileImageProps> = ({ filePath, handleShareFile }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const { t } = useTranslation();

  const handleSaveImage = async () => {
    saveMedia(filePath, t);
    await customAnalyticsEvent(ANALYTICS_EVENTS.SAVE_ITEM, {
      item_type: FileType.IMAGE,
    });
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
            onPress={() => handleShareFile(FileType.IMAGE)}
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
        uri: filePath,
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
