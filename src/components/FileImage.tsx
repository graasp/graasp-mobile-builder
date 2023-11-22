import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { ANALYTICS_EVENTS, PRIMARY_COLOR } from '../config/constants/constants';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { saveMedia } from '../utils/functions/media';

interface FileImageProps {
  filePath: string;
  handleShareFile: () => Promise<void>;
  mimetype: string;
}

const FileImage: FC<FileImageProps> = ({
  filePath,
  handleShareFile,
  mimetype,
}) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const { t } = useTranslation();

  const handleSaveImage = async () => {
    saveMedia(filePath, t);
    await customAnalyticsEvent(ANALYTICS_EVENTS.SAVE_ITEM, {
      item_type: mimetype,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <Button
            buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
            icon={<MaterialIcons name={'save-alt'} color="#ffffff" size={25} />}
            onPress={handleSaveImage}
          ></Button>
          <Button
            buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
            icon={
              <MaterialIcons name={'ios-share'} color="#ffffff" size={25} />
            }
            onPress={() => handleShareFile()}
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
