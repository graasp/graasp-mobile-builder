import React, { FC } from 'react';
import { ActivityIndicator as ActInd, StyleSheet, View } from 'react-native';

const ActivityIndicator: FC = () => {
  return (
    <View style={styles.container}>
      <ActInd size="large" color="#5050d2" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityIndicator;
