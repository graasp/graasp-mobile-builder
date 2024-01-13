import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import {
  CHAT_BUTTON_HEADER,
  UNSUPPORTED_SHARE,
} from '../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../config/constants/constants';
import { ItemScreenProps } from '../navigation/types';
import { handleOpenChat } from '../utils/functions/chat';
import FileHeaderButton from './common/FileHederButton';

interface FileImageProps {
  filePath: string;
  handleShareFile: () => Promise<void>;
  isPlayerView: boolean;
  item: DiscriminatedItem;
}

const FileImage: FC<FileImageProps> = ({
  handleShareFile,
  isPlayerView,
  item,
}) => {
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <FileHeaderButton
              name="chat"
              handler={() => handleOpenChat(navigation, item)}
              testID={CHAT_BUTTON_HEADER}
            />
            <FileHeaderButton name="ios-share" handler={handleShareFile} />
          </View>
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
        testID={UNSUPPORTED_SHARE}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  fileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    width: 82,
  },
});

export default FileImage;
