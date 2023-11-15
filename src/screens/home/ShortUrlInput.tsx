import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
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
          // label={t('url')}
          //   inputStyle={{ borderColor: PRIMARY_COLOR }}
          style={{}}
          placeholder={t('url')!}
          // onChangeText={(value) => setItemName(value)}
          // value={itemName}
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
