import { FC, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { buildSignInPath } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { SIGN_IN_BUTTON, SIGN_UP_BUTTON } from '../../e2e/constants/testIds';
import GraaspLogo from '../components/common/GraaspLogo';
import {
  PLATFORM_OS,
  PRIMARY_COLOR,
  WEB_BROWSER_REDIRECT_RESULT_TYPE,
  buildSignUpPath,
} from '../config/constants/constants';
import { GRAASP_AUTH_HOST } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '../context/QueryClientContext';
import type {
  RootNavigationProp,
  RootStackParamList,
} from '../navigation/RootNavigator';
import { generateNonce } from '../utils/functions/generateNonce';
import { checkLoginUri } from '../utils/functions/helper';
import { useAsync } from '../utils/hooks/useAsync';

export type SignInProps = StackScreenProps<
  RootStackParamList,
  'SignIn',
  'RootStackNavigator'
>;

const SignInScreen: FC<SignInProps> = ({ route: { params } }) => {
  const isSignUp = Boolean(params?.signUp);
  const authContext = useAuth();
  const { userToken, signIn: signInWithToken } = authContext;
  const deepLink = Linking.useURL();
  const { isLoading } = useAsync(null);
  const { navigate } = useNavigation<RootNavigationProp>();

  const { hooks } = useQueryClient();
  const { data: currentMember, refetch } = hooks.useCurrentMember();

  // redirect to main if member is signed in
  useEffect(() => {
    if (currentMember) {
      navigate('Main');
    }
  }, [currentMember]);

  // necessary manual refetch because axios interceptor might have change
  useEffect(() => {
    if (userToken) {
      refetch();
    }
  }, [userToken]);

  useEffect(() => {
    // Catch email-link on iOS/Android and email-password on Android login redirection
    if (deepLink) {
      const parsedDeepLink = Linking.parse(deepLink);
      if (checkLoginUri(parsedDeepLink)) {
        if (Platform.OS === PLATFORM_OS.IOS) {
          WebBrowser.dismissAuthSession();
        }
        signInWithToken(parsedDeepLink.queryParams?.t);
      }
    }
  }, [deepLink]);

  const _handlePressLoginButtonAsync = async () => {
    try {
      const challenge = await generateNonce();
      const SIGN_IN_PATH = buildSignInPath({ host: GRAASP_AUTH_HOST });
      const loginResponse = await WebBrowser.openAuthSessionAsync(
        `${SIGN_IN_PATH}?m=${challenge}`,
      );
      // Catch email-password on iOS login redirection
      if (
        loginResponse.type === WEB_BROWSER_REDIRECT_RESULT_TYPE &&
        loginResponse.url
      ) {
        const parsedDeepLink = Linking.parse(loginResponse.url);
        await signInWithToken(parsedDeepLink?.queryParams?.t);
      } else {
        if (Platform.OS === PLATFORM_OS.IOS) {
          WebBrowser.dismissAuthSession();
        }
      }
    } catch {
      throw new Error('Sign in error');
    }
  };

  const _handlePressSignUpButtonAsync = async () => {
    try {
      const challenge = await generateNonce();
      const authUrl = buildSignUpPath({ host: GRAASP_AUTH_HOST }, challenge);
      await WebBrowser.openAuthSessionAsync(authUrl);
    } catch (err) {
      console.error(err);
      throw new Error('Sign in error');
    }
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
          titleStyle={{ color: PRIMARY_COLOR, fontWeight: '700' }}
          title="Sign in"
          disabled={isLoading}
          onPress={_handlePressLoginButtonAsync}
          testID={SIGN_IN_BUTTON}
        />
        {!isSignUp && (
          <Button
            buttonStyle={{
              backgroundColor: PRIMARY_COLOR,
              width: '100%',
              borderWidth: 3,
              borderColor: '#fff',
            }}
            titleStyle={{ color: '#fff', fontWeight: '700' }}
            title="Sign up"
            disabled={isLoading}
            onPress={_handlePressSignUpButtonAsync}
            testID={SIGN_UP_BUTTON}
          />
        )}

        <Button
          buttonStyle={{
            backgroundColor: PRIMARY_COLOR,
            width: '100%',
            borderWidth: 3,
            borderColor: PRIMARY_COLOR,
            marginTop: 16,
          }}
          titleStyle={{ color: '#fff', fontWeight: '700' }}
          title="Later"
          disabled={isLoading}
          onPress={() => {
            navigate('Main');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'space-between',
    padding: 30,
  },
  logoContainer: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
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
