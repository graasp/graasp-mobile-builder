import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, CheckBox, Text } from 'react-native-elements';

import { CompleteMember, DEFAULT_LANG } from '@graasp/sdk';

import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { langs } from '../config/i18n';
import { useQueryClient } from '../context/QueryClientContext';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface LanguageSelectorProps {
  currentMember: CompleteMember;
  setChangeLanguageModalVisible: React.Dispatch<
    React.SetStateAction<{
      toggle: boolean;
    }>
  >;
  refresh: () => void;
}

const LanguageSelector: FC<LanguageSelectorProps> = ({
  currentMember,
  setChangeLanguageModalVisible,
}) => {
  const { t } = useTranslation();
  const lang = currentMember.extra?.lang;
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    lang || DEFAULT_LANG,
  );
  const { mutations } = useQueryClient();
  const editMemberMutation = mutations.useEditMember();

  const acceptChangeLanguage = async () => {
    editMemberMutation.mutate({
      id: currentMember.id,
      extra: {
        lang: `${selectedLanguage}`,
      },
    });
    setChangeLanguageModalVisible({ toggle: false });
    await customAnalyticsEvent(ANALYTICS_EVENTS.CHANGE_LANGUAGE);
  };

  const cancelChangeLanguage = () => {
    setChangeLanguageModalVisible({ toggle: false });
  };

  return (
    <>
      <Text style={styles.title}>{`Change member language`}</Text>
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
          buttonStyle={{ backgroundColor: '#5050d2' }}
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
