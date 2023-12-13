import { createContext, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import * as SecureStore from 'expo-secure-store';

import { configureQueryClient } from '@graasp/query-client';

import { SECURE_STORE_VALUES } from '../config/constants/constants';
import { API_HOST } from '../config/env';
import { useAuth } from './AuthContext';

type QueryClientConfigReturn = ReturnType<typeof configureQueryClient>;

export const QueryClientContext = createContext<{
  queryConfig: QueryClientConfigReturn['queryConfig'];
  queryClient: QueryClientConfigReturn['queryClient'];
  hooks: QueryClientConfigReturn['hooks'];
  mutations: QueryClientConfigReturn['mutations'];
}>({
  queryConfig: {} as QueryClientConfigReturn['queryConfig'],
  queryClient: {} as QueryClientConfigReturn['queryClient'],
  hooks: {} as unknown as QueryClientConfigReturn['hooks'],
  mutations: {} as unknown as ReturnType<
    typeof configureQueryClient
  >['mutations'],
});

export const QueryClientProvider = ({ children }: any) => {
  const {
    signOut,
    userToken,
    getAuthTokenByRefreshToken,
    setUserToken,
    setRefreshToken,
  } = useAuth();
  const { t } = useTranslation();
  // we use an array to be able to stack them and safely remove them all
  const [interceptors, setInterceptors] = useState<number[]>([]);

  // Create a client
  const {
    queryConfig,
    queryClient,
    QueryClientProvider: QCProvider,
    hooks,
    mutations,
  } = useMemo(() => {
    const state = configureQueryClient({
      API_HOST,
      notifier: (e) => {
        // todo: use toaster
        console.log(e);
      },
      onConfigAxios: (axios) => {
        // remove previous interceptors
        if (interceptors.length) {
          interceptors.forEach((interceptor) => {
            axios.interceptors.request.eject(interceptor);
          });
        }

        // always set token in headers
        const bearer = axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          if (config.headers && userToken) {
            config.headers.Authorization = `Bearer ${userToken}`;
          }
          return config;
        });

        // refresh interceptors
        const refetch = axios.interceptors.response.use(
          (response) => {
            return response;
          },
          async function (error) {
            const originalRequest = error.config;
            if (
              error?.response?.status === 401 &&
              !originalRequest?.sent &&
              !userToken
            ) {
              try {
                // we have to use the direct value from the store
                const refreshToken = await SecureStore.getItemAsync(
                  SECURE_STORE_VALUES.REFRESH_TOKEN,
                );
                if (!refreshToken) {
                  Toast.show({
                    type: 'error',
                    text1: t('You must sign in again'),
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
                await setUserToken(newAuthToken);
                await setRefreshToken(newRefreshToken);
                return axios(originalRequest);
              } catch (e) {
                console.error(e);
                Toast.show({
                  type: 'error',
                  text1: t('You must sign in again'),
                });
                signOut();
                return Promise.reject(error);
              }
            }
            return Promise.reject(error);
          },
        );
        setInterceptors([...interceptors, bearer, refetch]);
      },
      enableWebsocket: false,
    });

    // remove cache of all queries
    state.queryClient.clear();

    return state;
  }, [userToken]);

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
