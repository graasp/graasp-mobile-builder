import React, { FC } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';

interface FileImageProps {
  filePath: string;
}
const height = Dimensions.get('window').height * 0.8;

const FileImage: FC<FileImageProps> = ({ filePath }) => {
  return (
    <Image
      resizeMode="contain"
      style={styles.image}
      source={{
        uri: filePath,
      }}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height,
  },
});

export default FileImage;
