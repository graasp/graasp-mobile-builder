import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { DiscriminatedItem } from '@graasp/sdk';

import * as Sentry from '@sentry/react-native';

import { UNSUPPORTED_ITEM } from '../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../config/constants/constants';

interface ItemunsupportedProps {
  item: DiscriminatedItem;
}

const ItemUnsupported: FC<ItemunsupportedProps> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t('ITEM_UNSUPPORTED_MESSAGE', {
          type: item.type,
        })}
      </Text>
      <Button
        title={t('Please add support for this item')}
        raised={true}
        buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
        onPress={() => {
          Sentry.captureException(
            new Error(`Support for ${item.type} requested`),
          );

          Alert.alert(
            t('REQUEST_ITEM_SUPPORT_ALERT_TITLE'),
            t('REQUEST_ITEM_SUPPORT_ALERT_MESSAGE'),
            [{ text: t('Close'), onPress: () => console.debug('Close alert') }],
          );
        }}
        icon={
          <MaterialIcons
            name="feedback"
            color="#ffffff"
            size={20}
            style={{ paddingRight: 10 }}
          />
        }
        testID={UNSUPPORTED_ITEM}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ItemUnsupported;
