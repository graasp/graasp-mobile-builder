import React, { FC } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TEXT_ALIGNMENT } from '../config/constants/constants';

interface DocumentProps {
  content: any;
}

const Document: FC<DocumentProps> = ({ content }) => {
  const { width } = useWindowDimensions();

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
            source={{ html: content }}
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
});

export default Document;
