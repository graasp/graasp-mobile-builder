import * as SecureStore from 'expo-secure-store';
import { ReactElement, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import * as Api from '../api';
import { axiosContentInstance } from '../config/axios';
import { useAuth } from './authContext';

const AxiosInterceptor = ({
  children,
}: {
  children: ReactElement<any, any>;
}) => {
  const authContext = useAuth();
  const dispatch = authContext?.dispatch;
  const { signOut, restoreUserRefreshToken } = authContext;
  const { t } = useTranslation();

  if (!dispatch) {
    throw new Error(`Context error`);
  }

  useLayoutEffect(() => {
    const interceptor = axiosContentInstance.interceptors.response.use(
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
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (!refreshToken) {
              Toast.show({
                type: 'error',
                text1: t('You must log in again')!,
              });
              signOut();
              return Promise.reject(error);
            }
            const data = await Api.getAuthTokenByRefreshToken(refreshToken);
            const newAuthToken = data.authToken;
            const newRefreshToken = data.refreshToken;
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAuthToken}`,
            };
            restoreUserRefreshToken(newAuthToken, newRefreshToken);
            return axiosContentInstance(originalRequest);
          } catch {
            Toast.show({
              type: 'error',
              text1: t('You must log in again')!,
            });
            signOut();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      },
    );
    return () => axiosContentInstance.interceptors.response.eject(interceptor);
  });
  return children;
};

export { AxiosInterceptor };
