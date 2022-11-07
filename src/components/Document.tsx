import React, { FC } from 'react';
import RenderHtml from 'react-native-render-html';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DocumentProps {
  content: any;
}

const Document: FC<DocumentProps> = ({ content }) => {
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView edges={['left']}>
      <ScrollView>
        <RenderHtml
          contentWidth={width}
          source={{ html: content }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (width: any) => StyleSheet.create({
  editor: {
    flex: 1,
    padding: 0,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white',
    width,
  },
});

export default Document;
