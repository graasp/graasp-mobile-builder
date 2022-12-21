import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

interface FileAudioPlayerProps {
  filePath: string;
}

const FileAudioPlayer: FC<FileAudioPlayerProps> = ({ filePath }) => {
  const [sound, setSound] = useState<any>();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: filePath });
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Button
        title={'Play audio'}
        raised={true}
        buttonStyle={{ backgroundColor: '#5050d2' }}
        onPress={playSound}
        icon={
          <MaterialIcons
            name={'play-circle-outline'}
            color="#ffffff"
            size={20}
            style={{ paddingRight: 3 }}
          />
        }
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FileAudioPlayer;
