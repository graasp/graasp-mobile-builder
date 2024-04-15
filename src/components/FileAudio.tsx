import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import { DiscriminatedItem } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { PRIMARY_COLOR } from '../config/constants/constants';
import { ItemScreenProps } from '../navigation/types';
import ChatButton from './common/ChatButton';
import FileHeaderButton from './common/FileHederButton';

interface FileAudioProps {
  filePath: string;
  handleShareFile: () => Promise<void>;
  isPlayerView: boolean;
  item: DiscriminatedItem;
}

const FileAudio: FC<FileAudioProps> = ({
  filePath,
  handleShareFile,
  isPlayerView,
  item,
}) => {
  const [sound, setSound] = useState<any>();
  const navigation =
    useNavigation<ItemScreenProps<'ItemStackItem'>['navigation']>();
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
    if (!isPlayerView) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtons}>
            <ChatButton item={item} />
            <FileHeaderButton name="ios-share" handler={handleShareFile} />
          </View>
        ),
      });
    }
  }, [isPlayerView]);

  return (
    <View style={styles.container}>
      <Button
        title={t('Play audio')}
        raised={true}
        buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
});

export default FileAudio;
