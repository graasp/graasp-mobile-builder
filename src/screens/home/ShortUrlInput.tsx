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
    // allow to
    // this works as long as there is only one id in the url!
    // todo: use uuid
    const isUuid = /((\w{4,12}-?)){5}/.exec(url) && url.length === 36;
    const itemId = isUuid ? url : getItemIdFromUrl(url);
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
      <Input
        value={url}
        onChangeText={(value) => setUrl(value)}
        style={{}}
        placeholder={t('GO_TO_LINK_INPUT')}
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
      <Button
        title={t('Submit')}
        buttonStyle={{ backgroundColor: PRIMARY_COLOR, maxWidth: 100 }}
        onPress={submitUrl}
        testID={URL_INPUT_SUBMIT_BUTTON}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
  container: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
  },
});

export default ShortUrlInput;
