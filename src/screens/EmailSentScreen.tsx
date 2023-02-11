import { Entypo } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LOGIN_TYPE } from '../config/constants/constants';
import { useAuth } from '../context/authContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type EmailSentProps = StackScreenProps<
  RootStackParamList,
  'EmailSent',
  'RootStackNavigator'
>;

const EmailSentScreen: FC<EmailSentProps> = ({ route }) => {
  const { t } = useTranslation();
  const authContext = useAuth();
  const signInWithToken = authContext?.signIn;
  const token = route.params?.t;

  useEffect(() => {
    if (token) {
      signInWithToken(token, LOGIN_TYPE.EMAIL_LINK);
    }
  }, [token]);
  return (
    <SafeAreaView style={styles.container}>
      <Text h2Style={{ fontWeight: '700' }} style={styles.textInput} h2>
        Graasp
      </Text>
      <Entypo
        style={{ alignSelf: 'center' }}
        name="mail"
        size={120}
        color="white"
      />
      <Text style={styles.textInput} h4>
        {t('Please check your email for your login link.')}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5050d2',
    justifyContent: 'space-between',
    padding: 30,
  },
  textInput: {
    color: '#fff',
  },
});

export default EmailSentScreen;
