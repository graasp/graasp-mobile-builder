import { FC, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import { CHAT_BUTTON_HEADER } from '../../e2e/constants/testIds';
import { TEXT_ALIGNMENT } from '../config/constants/constants';
import { handleOpenChat } from '../utils/functions/chat';
import FileHeaderButton from './common/FileHederButton';
import { ItemScreenProps } from '../navigation/types';

interface DocumentProps {
  item: any;
  isPlayerView?: boolean;
}

const Document: FC<DocumentProps> = ({ item, isPlayerView = false }) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();

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
          </View>
        ),
      });
    }
  }, [isPlayerView]);

  const classStyles = {
    'ql-align-right': { textAlign: TEXT_ALIGNMENT.RIGHT },
    'ql-align-center': { textAlign: TEXT_ALIGNMENT.CENTER },
    'ql-align-left': { textAlign: TEXT_ALIGNMENT.LEFT },
    'ql-align-justify': { textAlign: TEXT_ALIGNMENT.JUSTIFY },
  };

  return (
    <SafeAreaView edges={['left']}>
      <View style={styles.container}>
        <ScrollView>
          <RenderHtml
            classesStyles={classStyles}
            contentWidth={width}
            source={{ html: item.extra.document?.content }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    width: 41,
  },
});

export default Document;
