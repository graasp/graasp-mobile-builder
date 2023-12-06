import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

import * as SecureStore from 'expo-secure-store';

import { axiosAuthInstance } from '../config/axios';
import {
  ANALYTICS_EVENTS,
  SECURE_STORE_VALUES,
} from '../config/constants/constants';
import { API_HOST } from '../config/env';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface AuthContextInterface {
  signIn: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  restoreUserRefreshToken: (
    newAuthToken: string,
    newRefreshToken: string,
  ) => object;
  userToken: string | null;
  setUserToken: React.Dispatch<string | null>;
  getAuthTokenByRefreshToken: (refreshToken: string) => Promise<{
    authToken: string;
    refreshToken: string;
  }>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);
AuthContext.displayName = 'AuthContext';

const AuthProvider = (props: any) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync(
          SECURE_STORE_VALUES.AUTH_TOKEN,
        );
      } catch {
        userToken = null;
      }
      setUserToken(userToken);
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextInterface = useMemo(
    () => ({
      userToken,
      setUserToken,
      signIn: async (data) => {
        try {
          const nonce = await SecureStore.getItemAsync(
            SECURE_STORE_VALUES.NONCE,
          );
          const response = await axiosAuthInstance.post(`${API_HOST}/m/auth`, {
            t: data,
            verifier: nonce,
          });
          if (response.data?.authToken && response.data?.refreshToken) {
            const token = response.data?.authToken;
            const refreshToken = response.data?.refreshToken;
            setUserToken(token);
            await SecureStore.setItemAsync(
              SECURE_STORE_VALUES.AUTH_TOKEN,
              token,
            );
            await SecureStore.setItemAsync(
              SECURE_STORE_VALUES.REFRESH_TOKEN,
              refreshToken,
            );
          }
        } catch {
          Toast.show({
            type: 'error',
            text1: 'Error logging in',
          });
          throw new Error('Sign in auth error');
        }
      },
      signOut: async () => {
        // TODO: add alert indicating automatic log out because refresh token has expired
        await axiosAuthInstance.get(`${API_HOST}/logout`);
        setUserToken(null);
        await SecureStore.deleteItemAsync(SECURE_STORE_VALUES.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_STORE_VALUES.REFRESH_TOKEN);
        await customAnalyticsEvent(ANALYTICS_EVENTS.LOG_OUT);
      },
      restoreUserRefreshToken: async (newAuthToken, newRefreshToken) => {
        setUserToken(newAuthToken);
        await SecureStore.setItemAsync(
          SECURE_STORE_VALUES.AUTH_TOKEN,
          newAuthToken,
        );
        await SecureStore.setItemAsync(
          SECURE_STORE_VALUES.REFRESH_TOKEN,
          newRefreshToken,
        );
      },
      getAuthTokenByRefreshToken: async (refreshToken: string) => {
        const res = await axiosAuthInstance.get(`${API_HOST}/m/auth/refresh`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: refreshToken ? `Bearer ${refreshToken}` : undefined,
          },
        });
        return res.data;
      },
    }),
    [userToken],
  );

  return <AuthContext.Provider value={authContext} {...props} />;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};

export { AuthProvider, useAuth };
