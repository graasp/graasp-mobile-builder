import { Member } from '@graasp/sdk';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, CheckBox, Text } from 'react-native-elements';
import { LANGUAGES } from '../config/constants/constants';
import { getLangExtra } from '../utils/functions/itemExtra';

interface LanguageSelectorProps {
  currentMember: Member;
  setChangeLanguageModalVisible: React.Dispatch<
  React.SetStateAction<{
    toggle: boolean;
  }>
>;
}

const LanguageSelector: FC<LanguageSelectorProps> = ({ currentMember, setChangeLanguageModalVisible }) => {
  const lang = getLangExtra(currentMember.extra);

  const [checkBoxOption, setCheckBoxOption] = useState<string>(lang || LANGUAGES.EN);

  const acceptChangeLanguage = () => {
    // TODO: mutation to change language
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
        checked={Boolean(checkBoxOption === LANGUAGES.EN)}
        onPress={() => setCheckBoxOption(LANGUAGES.EN)}
      />
      <CheckBox
        center
        title="Français"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checkedColor="#5050d2"
        containerStyle={styles.checkBoxContainer}
        checked={Boolean(checkBoxOption === LANGUAGES.FR)}
        onPress={() => setCheckBoxOption(LANGUAGES.FR)}
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
