import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import React, { FC, useEffect, useState } from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { buildGraaspAssetsPdfViewerRoute } from '../api/routes';
import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { UUID } from '../types';
import { downloadFileFromS3Url } from '../utils/functions/media';

interface FilePdfProps {
  filePath: string;
  itemId: UUID;
  mimetype: string;
}

const FilePdf: FC<FilePdfProps> = ({ filePath, itemId, mimetype }) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const dimensions = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const handleShareFileFromS3Url = async () => {
    if (filePath) {
      setIsDownloading(true);
      const localPath = await downloadFileFromS3Url(filePath, itemId, mimetype);
      setIsDownloading(false);
      Sharing.shareAsync(localPath);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          {isDownloading ? (
            <Button
              disabled
              disabledStyle={{ backgroundColor: '#5050d2' }}
              buttonStyle={{ backgroundColor: '#5050d2' }}
              icon={
                <MaterialIcons
                  name={'cloud-download'}
                  color="#ffffff"
                  size={25}
                />
              }
            ></Button>
          ) : (
            <Button
              buttonStyle={{ backgroundColor: '#5050d2' }}
              icon={
                <MaterialIcons name={'ios-share'} color="#ffffff" size={25} />
              }
              onPress={handleShareFileFromS3Url}
            ></Button>
          )}
        </View>
      ),
    });
  }, [isDownloading]);

  return (
    <WebView
      source={{ uri: buildGraaspAssetsPdfViewerRoute(filePath) }}
      scalesPageToFit={false}
      startInLoadingState={true}
      overScrollMode="never"
      cacheMode="LOAD_CACHE_ELSE_NETWORK"
      cacheEnabled={true}
      style={{
        width: dimensions.width - insets.left,
        height: 400,
        marginLeft: insets.left,
        marginBottom: insets.bottom,
      }}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    width: 41,
  },
});

export default FilePdf;
