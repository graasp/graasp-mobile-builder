import { FC, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DiscriminatedItem } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { TEXT_ALIGNMENT } from '../config/constants/constants';
import { ItemScreenProps } from '../navigation/types';
import ChatButton from './common/ChatButton';

interface DocumentProps {
  item: DiscriminatedItem;
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
  },
});

export default Document;
