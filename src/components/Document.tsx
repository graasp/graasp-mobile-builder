import React, { FC } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DocumentProps {
  content: any;
}

const Document: FC<DocumentProps> = ({ content }) => {
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView edges={['left']}>
      <View style={styles.container}>
        <ScrollView>
          <RenderHtml contentWidth={width} source={{ html: content }} />
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
