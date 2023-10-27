import { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import * as SecureStore from 'expo-secure-store';

import { configureQueryClient } from '@graasp/query-client';

// import {  AppState } from 'react-native';
import { API_HOST } from '../config/constants/constants';
import { useAuth } from './AuthContext';

// import { focusManager } from 'react-query';

export const QueryClientContext = createContext<{
  queryClient: any;
  hooks: ReturnType<typeof configureQueryClient>['hooks'];
  mutations: ReturnType<typeof configureQueryClient>['mutations'];
  // useQueryClient:any,
}>({
  queryClient: {},
  //   useQueryClient: () => {},
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
    queryClient,
    // useQueryClient,
    QueryClientProvider: QCProvider,
    hooks,
    // ReactQueryDevtools,
    mutations,
  } = configureQueryClient({
    API_HOST,
    notifier: (e) => {
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
    //   defaultQueryOptions: {
    //     keepPreviousData: true,
    //     refetchOnMount: false,
    //     // avoid refetching when same data are closely fetched
    //     staleTime: 1000, // ms
    //     cacheTime: 1000, // ms
    //   },
  });

  //   focusManager.setEventListener(() => {
  //     const handleAppStateChange = (appState: any) => {
  //       console.log('AppState: ', appState);
  //       focusManager.setFocused(appState === 'active');
  //     };

  //     const appState = AppState.addEventListener('change', handleAppStateChange);

  //     return () => {
  //       appState.remove();
  //     };
  //   });

  const value = {
    queryClient,
    // useQueryClient,
    hooks,
    mutations,
  };

  return (
    <QueryClientContext.Provider value={value}>
      <QCProvider client={queryClient}>
        <>
          {children}
          {/* <ReactQueryDevtools /> */}
        </>
      </QCProvider>
    </QueryClientContext.Provider>
  );
};

export const useQueryClient = () => useContext(QueryClientContext);
