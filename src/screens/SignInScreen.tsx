import { StackScreenProps } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  buildGraaspAuthLoginRoute,
  buildGraaspAuthSignUpRoute,
} from '../api/routes';
import GraaspLogo from '../components/common/GraaspLogo';
import { RootStackParamList } from '../navigation/RootNavigator';
import { generateNonce } from '../utils/functions/generateNonce';
import { useAsync } from '../utils/hooks/useAsync';

type SignInProps = StackScreenProps<
  RootStackParamList,
  'SignIn',
  'RootStackNavigator'
>;

const SignInScreen: FC<SignInProps> = ({ route: { params } }) => {
  const isSignUp = Boolean(params?.signUp);
  const { isLoading } = useAsync(null);

  const _handlePressLoginButtonAsync = async () => {
    const challenge = await generateNonce();
    const authUrl = buildGraaspAuthLoginRoute(challenge);
    Linking.openURL(authUrl);
  };

  const _handlePressSignUpButtonAsync = async () => {
    const challenge = await generateNonce();
    const authUrl = buildGraaspAuthSignUpRoute(challenge);
    await WebBrowser.openBrowserAsync(authUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
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

      <View style={styles.buttons}>
        <Button
          buttonStyle={{
            backgroundColor: '#fff',
            width: '100%',
            marginBottom: 25,
            borderWidth: 3,
            borderColor: '#fff',
          }}
          titleStyle={{ color: '#5050d2', fontWeight: '700' }}
          title="Log in"
          disabled={isLoading}
          onPress={_handlePressLoginButtonAsync}
        />
        {!isSignUp && (
          <Button
            buttonStyle={{
              backgroundColor: '#5050d2',
              width: '100%',
              borderWidth: 3,
              borderColor: '#fff',
            }}
            titleStyle={{ color: '#fff', fontWeight: '700' }}
            title="Sign up"
            disabled={isLoading}
            onPress={_handlePressSignUpButtonAsync}
          />
        )}
      </View>
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
  logoContainer: {
    flex: 1,
    backgroundColor: '#5050d2',
    justifyContent: 'center',
    padding: 30,
  },
  buttons: {
    padding: 20,
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
