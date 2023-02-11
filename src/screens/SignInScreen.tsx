import analytics from '@react-native-firebase/analytics';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import GraaspLogo from '../components/common/GraaspLogo';
import { axiosAuthInstance } from '../config/axios';
import { API_HOST, LOGIN_TYPE } from '../config/constants/constants';
import { useAuth } from '../context/authContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { generateNonce } from '../utils/functions/generateNonce';
import { validateEmail } from '../utils/functions/helper';
import { useAsync } from '../utils/hooks/useAsync';

type SignInProps = StackScreenProps<
  RootStackParamList,
  'SignIn',
  'RootStackNavigator'
>;

const SignInScreen: FC<SignInProps> = ({ navigation, route: { params } }) => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginType, setLoginType] = useState<LOGIN_TYPE>(LOGIN_TYPE.EMAIL_LINK);
  const { t } = useTranslation();
  const isSignUp = Boolean(params?.signUp);
  const { run, isLoading } = useAsync(null);
  const authContext = useAuth();
  const signInWithToken = authContext?.signIn;

  const signIn = async (email: string) => {
    const challenge = await generateNonce();
    if (loginType === LOGIN_TYPE.EMAIL_LINK) {
      run(
        axiosAuthInstance.post(`${API_HOST}/m/login`, {
          email,
          challenge,
        }),
      );
      setEmail('');
      navigation.navigate('EmailSent', {});
    } else if (loginType === LOGIN_TYPE.EMAIL_PASSWORD) {
      run(
        axiosAuthInstance
          .post(`${API_HOST}/m/login-password`, {
            email,
            challenge,
            password,
          })
          .then((res) => {
            if (res.data.t) {
              signInWithToken(res.data.t, LOGIN_TYPE.EMAIL_PASSWORD);
            }
          })
          .catch((error) => {
            console.log('Error', error.message);
          }),
      );
      setEmail('');
      setPassword('');
    }
  };

  const signUp = async ({ email, name }: { email: string; name: string }) => {
    const challenge = await generateNonce();
    run(
      axiosAuthInstance.post(`${API_HOST}/m/register`, {
        name,
        email,
        challenge,
      }),
    );
    setName('');
    setEmail('');
    navigation.navigate('EmailSent', {});
    await analytics().logSignUp({ method: LOGIN_TYPE.EMAIL_LINK });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.logo}>
          <GraaspLogo />
        </View>
        <Text
          h2Style={{ fontWeight: '700' }}
          style={[styles.appName, { marginBottom: 0 }]}
          h2
        >
          Graasp
        </Text>
      </View>
      <ScrollView>
        {isSignUp && (
          <Input
            label={t('Name')}
            placeholder={t('name')!}
            inputStyle={styles.textInput}
            onChangeText={(value) => setName(value)}
            value={name}
            underlineColorAndroid={'#fff'}
            labelStyle={{
              color: '#fff',
              fontWeight: '700',
            }}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#cccccc"
            autoCompleteType={undefined}
          />
        )}
        <Input
          label={t('Email address')}
          textContentType="username"
          autoComplete="email"
          placeholder="email@example.com"
          inputStyle={styles.textInput}
          onChangeText={(value) => setEmail(value.toLowerCase())}
          value={email}
          underlineColorAndroid={'#fff'}
          labelStyle={{
            color: '#fff',
            fontWeight: '700',
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#cccccc"
          autoCompleteType={undefined}
        />
        {!isSignUp && loginType === LOGIN_TYPE.EMAIL_PASSWORD && (
          <Input
            label={t('Password')}
            textContentType="password"
            autoComplete="password"
            secureTextEntry={true}
            inputStyle={styles.textInput}
            onChangeText={(value) => setPassword(value)}
            value={password}
            underlineColorAndroid={'#fff'}
            labelStyle={{
              color: '#fff',
              fontWeight: '700',
            }}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#cccccc"
            autoCompleteType={undefined}
          />
        )}
        {isSignUp ? (
          <Button
            buttonStyle={{ backgroundColor: '#fff' }}
            titleStyle={{ color: '#5050d2', fontWeight: '700' }}
            title="Sign Up"
            disabled={!validateEmail(email) || isLoading}
            onPress={() => {
              signUp({ email, name });
            }}
          />
        ) : (
          <Button
            buttonStyle={{ backgroundColor: '#fff' }}
            titleStyle={{ color: '#5050d2', fontWeight: '700' }}
            title="Login"
            disabled={!validateEmail(email) || isLoading}
            onPress={() => {
              signIn(email);
            }}
          />
        )}
        {!isSignUp && (
          <>
            {loginType === LOGIN_TYPE.EMAIL_PASSWORD && (
              <Text
                style={{
                  color: '#fff',
                  alignSelf: 'center',
                  paddingEnd: 8,
                  paddingTop: 30,
                }}
                onPress={() => setLoginType(LOGIN_TYPE.EMAIL_LINK)}
              >
                {t('Use email magic link login')} {'->'}
              </Text>
            )}
            {loginType === LOGIN_TYPE.EMAIL_LINK && (
              <Text
                style={{
                  color: '#fff',
                  alignSelf: 'center',
                  paddingEnd: 8,
                  paddingTop: 30,
                }}
                onPress={() => setLoginType(LOGIN_TYPE.EMAIL_PASSWORD)}
              >
                {t('Use password login')} {'->'}
              </Text>
            )}
          </>
        )}
        {!isSignUp && (
          <Text
            style={{
              color: '#fff',
              alignSelf: 'center',
              paddingEnd: 8,
              paddingTop: 20,
            }}
            onPress={() => navigation.push('SignIn', { signUp: true })}
          >
            {t("Don't have an account yet? Sign up now")} {'->'}
          </Text>
        )}
      </ScrollView>
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
  logo: {
    alignSelf: 'center',
  },
  appName: {
    color: '#fff',
    alignSelf: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  textInput: {
    color: '#fff',
  },
});

export default SignInScreen;
