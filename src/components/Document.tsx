import { FC, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DocumentItemType } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { TEXT_ALIGNMENT } from '../config/constants/constants';
import { ItemScreenProps } from '../navigation/types';
import ChatButton from './common/ChatButton';

interface DocumentProps {
  item: DocumentItemType;
  isPlayerView?: boolean;
}

const Document: FC<DocumentProps> = ({ item, isPlayerView = false }) => {
  const { width } = useWindowDimensions();
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

  useEffect(() => {
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <ChatButton item={item} />
          </View>
        ),
      });
    }
  }, [isPlayerView]);

  const classStyles = {
    'ql-align-right': {
      textAlign: TEXT_ALIGNMENT.RIGHT,
    },
    'ql-align-center': {
      textAlign: TEXT_ALIGNMENT.CENTER,
    },
    'ql-align-left': {
      textAlign: TEXT_ALIGNMENT.LEFT,
    },
    'ql-align-justify': {
      textAlign: TEXT_ALIGNMENT.JUSTIFY,
    },
  };

  const styles = StyleSheet.create({
    container: {
      width,
      paddingHorizontal: 20,
    },
    headerButtons: {
      flexDirection: 'row',
    },
  });

  return (
    <SafeAreaView edges={['left']}>
      <ScrollView>
        <View style={styles.container}>
          <RenderHtml
            tagsStyles={{
              p: { marginBottom: 1 },
            }}
            classesStyles={classStyles}
            contentWidth={width}
            source={{ html: item.extra.document?.content }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Document;
