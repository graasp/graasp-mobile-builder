import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

const EmptyList = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.emptyIcon}>
        <MaterialIcons name="folder-open" size={50} />
      </View>
      <Text style={styles.text}>{t('This folder is empty.')}</Text>
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

export default EmptyList;
