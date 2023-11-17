import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from 'react-native-elements';

import { PRIMARY_COLOR } from '../../config/constants/constants';

function ShortUrlInput() {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');

  const submitUrl = () => {
    alert(url);
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
          onChangeText={(value) => setUrl(value)}
          style={{}}
          placeholder={t('url')}
          underlineColorAndroid={'black'}
          labelStyle={{
            color: 'black',
            fontWeight: '700',
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#cccccc"
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
