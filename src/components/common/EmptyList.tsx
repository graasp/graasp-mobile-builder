import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EmptyList = () => {
  return (
    <View style={styles.container}>
      <Text>No items found.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default EmptyList;
