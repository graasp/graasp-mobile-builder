import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DimensionValue, Image, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  IMAGE_ITEM,
  IMAGE_SAVE,
  IMAGE_SHARE,
} from '../../e2e/constants/testIds';
import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { saveMedia } from '../utils/functions/media';
import FileHeaderButton from './common/FileHederButton';

interface FileImageProps {
  filePath: string;
  handleShareFile: () => Promise<void>;
  mimetype: string;
  isPlayerView: boolean;
}

const FileImage: FC<FileImageProps> = ({
  filePath,
  handleShareFile,
  mimetype,
  isPlayerView,
}) => {
  const [imageSize, setImageSize] = useState<{
    width: DimensionValue;
    height: DimensionValue;
  }>({ width: '100%', height: '100%' });
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const { t } = useTranslation();

  useEffect(() => {
    Image.getSize(
      filePath,
      (width, height) => {
        setImageSize({ width, height });
      },
      (error) => console.error(error),
    );
  }, []);

  useEffect(() => {
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <FileHeaderButton
              name="save-alt"
              handler={handleSaveImage}
              testID={IMAGE_SAVE}
            />
            <FileHeaderButton
              name="ios-share"
              handler={handleShareFile}
              testID={IMAGE_SHARE}
            />
          </View>
        ),
      });
    }
  }, [isPlayerView]);

  const handleSaveImage = async () => {
    saveMedia(filePath, t);
    await customAnalyticsEvent(ANALYTICS_EVENTS.SAVE_ITEM, {
      item_type: mimetype,
    });
  };

  return (
    <View style={styles.imageContainer}>
      <Image
        resizeMode="contain"
        style={{ height: imageSize.height, width: imageSize.width }}
        source={{
          uri: filePath,
        }}
        testID={IMAGE_ITEM}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    width: 82,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default FileImage;
