import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';

import {
  URL_INPUT,
  URL_INPUT_SUBMIT_BUTTON,
} from '../../../e2e/constants/testIds';
import { PRIMARY_COLOR } from '../../config/constants/constants';
import { ITEM_NAVIGATOR, ITEM_NAVIGATOR_ITEM } from '../../navigation/names';
import { TabScreenProps } from '../../navigation/types';
import { getItemIdFromUrl } from '../../utils/functions/url';

function ShortUrlInput() {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const { navigate } = useNavigation<TabScreenProps<'HomeTab'>['navigation']>();

  const submitUrl = () => {
    const itemId = getItemIdFromUrl(url);
    if (itemId) {
      setUrl('');
      navigate(ITEM_NAVIGATOR, {
        screen: ITEM_NAVIGATOR_ITEM,
        params: { itemId },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexBasis: 'auto',
          flexGrow: 3,
        }}
      >
        <Input
          value={url}
          onChangeText={(value) => setUrl(value)}
          style={{}}
          placeholder={t('link')}
          underlineColorAndroid={'black'}
          labelStyle={{
            color: 'black',
            fontWeight: '700',
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#cccccc"
          testID={URL_INPUT}
        />
      </View>
      <View
        style={{
          flex: 2,
          flexBasis: 'auto',
          flexGrow: 1,
        }}
      >
        <Button
          title="Submit"
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={submitUrl}
          testID={URL_INPUT_SUBMIT_BUTTON}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 20,
  },
});

export default ShortUrlInput;
