import { Member } from '@graasp/sdk';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, CheckBox, Text } from 'react-native-elements';
import { useMutation } from 'react-query';

import { LANGUAGES } from '../config/constants/constants';
import { buildEditMember } from '../mutations/utils';
import { getLangExtra } from '../utils/functions/itemExtra';
import { getUserToken } from '../utils/functions/token';

interface LanguageSelectorProps {
  currentMember: Member;
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
  refresh,
}) => {
  const lang = getLangExtra(currentMember.extra);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    lang || LANGUAGES.EN,
  );
  const userToken: any = getUserToken();
  const editMemberMutation = useMutation({
    ...buildEditMember(userToken, refresh),
  });

  const acceptChangeLanguage = () => {
    editMemberMutation.mutate({
      id: currentMember.id,
      extra: {
        lang: `${selectedLanguage}`,
      },
    });
    setChangeLanguageModalVisible({ toggle: false });
  };

  const cancelChangeLanguage = () => {
    setChangeLanguageModalVisible({ toggle: false });
  };

  return (
    <>
      <Text style={styles.title}>{`Change member language`}</Text>
      <CheckBox
        center
        title="English"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checkedColor="#5050d2"
        containerStyle={styles.checkBoxContainer}
        checked={Boolean(selectedLanguage === LANGUAGES.EN)}
        onPress={() => setSelectedLanguage(LANGUAGES.EN)}
      />
      <CheckBox
        center
        title="Français"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checkedColor="#5050d2"
        containerStyle={styles.checkBoxContainer}
        checked={Boolean(selectedLanguage === LANGUAGES.FR)}
        onPress={() => setSelectedLanguage(LANGUAGES.FR)}
      />
      <View style={styles.acceptChangeLanguageButton}>
        <Button
          title="Accept"
          raised={true}
          buttonStyle={{ backgroundColor: '#5050d2' }}
          onPress={acceptChangeLanguage}
        />
      </View>
      <Button
        title="Cancel"
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
