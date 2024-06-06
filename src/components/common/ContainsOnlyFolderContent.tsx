import { Trans } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useRoute } from '@react-navigation/native';

import { ItemScreenProps } from '../../navigation/types';

const ContainsOnlyFolderContent = () => {
  const route = useRoute<ItemScreenProps<'ItemStackPlayerFolder'>['route']>();
  const { headerTitle } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.emptyIcon}>
        <MaterialIcons name="folder-copy" size={50} />
      </View>
      <Text style={styles.text}>
        <Trans
          i18nKey="FOLDER_CONTAINS_ONLY_FOLDERS" // optional -> fallbacks to defaults if not provided
          values={{ title: headerTitle }}
          components={{ b: <Text style={{ fontWeight: 'bold' }} /> }}
        />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  emptyIcon: {
    paddingBottom: 20,
  },
});

export default ContainsOnlyFolderContent;
