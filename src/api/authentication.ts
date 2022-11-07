import { API_HOST } from '../config/constants/constants';
import { DEFAULT_GET } from './utils';
import { axiosAuthInstance } from '../config/axios';

export const getAuthTokenByRefreshToken = async (refreshToken: string) => {
  const res = await axiosAuthInstance.get(
    `${API_HOST}/m/auth/refresh`,
    DEFAULT_GET(refreshToken));
  return res.data;
};