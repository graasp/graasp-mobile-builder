import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

const EmptyList = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('No items found.')}</Text>
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
});

export default EmptyList;
