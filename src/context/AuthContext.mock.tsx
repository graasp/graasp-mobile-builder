import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import Toast from 'react-native-toast-message';

import * as SecureStore from 'expo-secure-store';

import { axiosAuthInstance } from '../config/axios';
import {
  ANALYTICS_EVENTS,
  AuthActionKind,
  SECURE_STORE_VALUES,
} from '../config/constants/constants';
import { API_HOST } from '../config/env';
import { customAnalyticsEvent } from '../utils/functions/analytics';

interface AuthContextInterface {
  signIn: (data: any) => object;
  signOut: () => object;
  restoreUserRefreshToken: (
    newAuthToken: string,
    newRefreshToken: string,
  ) => object;
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  getAuthTokenByRefreshToken: (refreshToken: string) => Promise<{
    authToken: string;
    refreshToken: string;
  }>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);
AuthContext.displayName = 'AuthContext';

type AuthAction = {
  type: AuthActionKind;
  token: string | null;
};

type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
};

const initialCounterState: AuthState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

const AuthProvider = (props: any) => {
  const [state, dispatch] = useReducer(
    (prevState: AuthState, action: AuthAction): AuthState => {
      switch (action.type) {
        case AuthActionKind.RESTORE_TOKEN:
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case AuthActionKind.SIGN_IN:
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case AuthActionKind.SIGN_OUT:
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    initialCounterState,
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        await SecureStore.setItemAsync(
          SECURE_STORE_VALUES.REFRESH_TOKEN,
          process.env.EXPO_PUBLIC_TEST_REFRESH_TOKEN!,
        );

        userToken = await SecureStore.getItemAsync(
          SECURE_STORE_VALUES.AUTH_TOKEN,
        );
      } catch {
        userToken = null;
      }
      dispatch({ type: AuthActionKind.RESTORE_TOKEN, token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextInterface = useMemo(
    () => ({
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
            dispatch({ type: AuthActionKind.SIGN_IN, token });
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
        dispatch({ type: AuthActionKind.SIGN_OUT, token: null });
        await SecureStore.deleteItemAsync(SECURE_STORE_VALUES.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(SECURE_STORE_VALUES.REFRESH_TOKEN);
        await customAnalyticsEvent(ANALYTICS_EVENTS.LOG_OUT);
      },
      restoreUserRefreshToken: async (newAuthToken, newRefreshToken) => {
        dispatch({ type: AuthActionKind.RESTORE_TOKEN, token: newAuthToken });
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
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: refreshToken ? `Bearer ${refreshToken}` : undefined,
          },
        });
        return res.data;
      },

      state,
      dispatch,
    }),
    [state],
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
