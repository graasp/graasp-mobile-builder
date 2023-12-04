import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { UNSUPPORTED_SHARE } from '../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../config/constants/constants';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import FileHeaderButton from './common/FileHederButton';

interface FileImageProps {
  filePath: string;
  handleShareFile: () => Promise<void>;
  isPlayerView: boolean;
}

const FileImage: FC<FileImageProps> = ({ handleShareFile, isPlayerView }) => {
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <FileHeaderButton name="ios-share" handler={handleShareFile} />
        ),
      });
    }
  }, [isPlayerView]);

  return (
    <View style={styles.fileContainer}>
      <Button
        title={t('Save file')}
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
    </View>
  );
};

const styles = StyleSheet.create({
  fileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default FileImage;
