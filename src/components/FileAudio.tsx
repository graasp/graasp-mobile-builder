import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { ItemScreenNavigationProp } from '../screens/ItemScreen';
import { FileType } from '../types';

interface FileAudioProps {
  filePath: string;
  handleShareFile: (fileType: FileType) => void;
}

const FileAudio: FC<FileAudioProps> = ({ filePath, handleShareFile }) => {
  const [sound, setSound] = useState<any>();
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const { t } = useTranslation();

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          buttonStyle={{ backgroundColor: '#5050d2' }}
          icon={<MaterialIcons name={'ios-share'} color="#ffffff" size={25} />}
          onPress={() => handleShareFile(FileType.AUDIO)}
        ></Button>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title={t('Play audio')!}
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
