import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';

interface FileAudioProps {
  localPath: string;
  handleSaveFile: () => void;
}

const FileAudio: FC<FileAudioProps> = ({ localPath, handleSaveFile }) => {
  const [sound, setSound] = useState<any>();
  const navigation = useNavigation<ItemScreenNavigationProp>();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: localPath });
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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: '#5050d2' }}
          icon={
            <MaterialIcons
              name={'ios-share'}
              color="#ffffff"
              size={25}
              style={{ paddingRight: 3 }}
            />
          }
          onPress={handleSaveFile}
        ></Button>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Play audio"
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

export default FileAudio;
