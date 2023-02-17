import { axiosContentInstance } from '../config/axios';
import { API_HOST } from '../config/constants/constants';
import { UUID } from '../types';
import { buildGetItemMembershipsRoute } from './routes';
import { DEFAULT_GET } from './utils';

export const getItemMemberships = async (id: UUID, token?: string) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetItemMembershipsRoute(id)}`,
    DEFAULT_GET(token),
  );
  return res.data;
};
