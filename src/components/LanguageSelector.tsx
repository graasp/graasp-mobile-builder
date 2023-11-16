import React, { FC, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, CheckBox, Text } from 'react-native-elements';

import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { langs } from '../config/i18n';
import { CurrentMemberContext } from '../context/CurrentMemberContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface LanguageSelectorProps {
  setChangeLanguageModalVisible: React.Dispatch<
    React.SetStateAction<{
      toggle: boolean;
    }>
  >;
  refresh: () => void;
}

const LanguageSelector: FC<LanguageSelectorProps> = ({
  setChangeLanguageModalVisible,
}) => {
  const { t } = useTranslation();
  const { lang, changeLang } = useContext(CurrentMemberContext);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(lang);

  const acceptChangeLanguage = async () => {
    await changeLang(selectedLanguage);
    setChangeLanguageModalVisible({ toggle: false });
    await customAnalyticsEvent(ANALYTICS_EVENTS.CHANGE_LANGUAGE);
  };

  const cancelChangeLanguage = () => {
    setChangeLanguageModalVisible({ toggle: false });
  };

  return (
    <>
      <Text style={styles.title}>{t('Change language')}</Text>
      {Object.entries(langs).map(([key, value]) => (
        <CheckBox
          center
          title={value}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor="#5050d2"
          containerStyle={styles.checkBoxContainer}
          checked={Boolean(selectedLanguage === key)}
          onPress={() => setSelectedLanguage(key)}
        />
      ))}
      <View style={styles.acceptChangeLanguageButton}>
        <Button
          title={t('Save')!}
          raised={true}
          buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
          onPress={acceptChangeLanguage}
        />
      </View>
      <Button
        title={t('Cancel')!}
        raised={true}
        buttonStyle={{ backgroundColor: '#b5b5b5' }}
        onPress={cancelChangeLanguage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  acceptChangeLanguageButton: {
    marginTop: 30,
    marginBottom: 10,
  },
  title: {
    paddingBottom: 30,
    fontSize: 16,
    fontWeight: '700',
  },
  checkBoxContainer: {
    backgroundColor: '#fff',
    borderWidth: 0,
  },
});

export default LanguageSelector;
