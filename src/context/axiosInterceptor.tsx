import * as SecureStore from 'expo-secure-store';
import { ReactElement, useEffect } from 'react';

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

  if (!dispatch) {
    throw new Error(`Context error`);
  }

  useEffect(() => {
    const interceptor = axiosContentInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error?.response?.status === 401 && !originalRequest?.sent) {
          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (!refreshToken) {
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
