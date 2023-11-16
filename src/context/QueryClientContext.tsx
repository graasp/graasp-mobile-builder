import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { QueryClient } from 'react-query';

import * as SecureStore from 'expo-secure-store';

import { QueryClientConfig, configureQueryClient } from '@graasp/query-client';

import { API_HOST } from '../config/env';
import { useAuth } from './AuthContext';

export const QueryClientContext = createContext<{
  queryConfig: ReturnType<typeof configureQueryClient>['queryConfig'];
  queryClient: QueryClient;
  hooks: ReturnType<typeof configureQueryClient>['hooks'];
  mutations: ReturnType<typeof configureQueryClient>['mutations'];
}>({
  queryConfig: {} as QueryClientConfig,
  queryClient: {} as QueryClient,
  hooks: {} as unknown as any,
  mutations: {} as unknown as any,
});

export const QueryClientProvider = ({ children }: any) => {
  const authContext = useAuth();
  const dispatch = authContext?.dispatch;
  const { signOut, restoreUserRefreshToken, getAuthTokenByRefreshToken } =
    authContext;
  const { t } = useTranslation();

  if (!dispatch) {
    throw new Error(`Context error`);
  }

  // Create a client
  const {
    queryConfig,
    queryClient,
    QueryClientProvider: QCProvider,
    hooks,
    mutations,
  } = configureQueryClient({
    API_HOST,
    notifier: (e) => {
      // todo: use toaster
      console.log(e);
    },
    onConfigAxios: (axios) => {
      // always set token in headers
      axios.interceptors.request.use(function (config) {
        const token = authContext?.state.userToken;
        // Do something before request is sent
        if (config.headers && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      // refresh interceptors
      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        async function (error) {
          const originalRequest = error.config;
          if (
            error?.response?.status === 401 &&
            !originalRequest?.sent &&
            !authContext.state.isSignout
          ) {
            try {
              const refreshToken =
                await SecureStore.getItemAsync('refreshToken');
              if (!refreshToken) {
                Toast.show({
                  type: 'error',
                  text1: t('You must sign in again')!,
                });
                signOut();
                return Promise.reject(error);
              }

              const data = await getAuthTokenByRefreshToken(refreshToken);
              const newAuthToken = data.authToken;
              const newRefreshToken = data.refreshToken;
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newAuthToken}`,
              };
              restoreUserRefreshToken(newAuthToken, newRefreshToken);
              return axios(originalRequest);
            } catch {
              Toast.show({
                type: 'error',
                text1: t('You must sign in again')!,
              });
              signOut();
              return Promise.reject(error);
            }
          }
          return Promise.reject(error);
        },
      );
    },
    enableWebsocket: false,
  });

  const value = {
    queryConfig,
    queryClient,
    hooks,
    mutations,
  };

  return (
    <QueryClientContext.Provider value={value}>
      <QCProvider client={queryClient}>{children}</QCProvider>
    </QueryClientContext.Provider>
  );
};

export const useQueryClient = () => useContext(QueryClientContext);
