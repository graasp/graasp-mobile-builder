import { DEFAULT_GET, buildGetItemLoginRoute } from './utils';
import { API_HOST } from '../config/constants/constants';
import {
  buildGetMemberBy,
  buildGetMember,
  GET_CURRENT_MEMBER_ROUTE,
} from './routes';
import { UUID } from '../types';
import { axiosContentInstance } from '../config/axios';

export const getMemberBy = async ({ email }: { email: string }) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetMemberBy(email)}`, 
    { ...DEFAULT_GET });
  return res.data;
};

export const getMember = async ({ id, token }: { id: UUID, token: string }) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetMember(id)}`, 
    { ...DEFAULT_GET(token) });
  return res.data;
};

export const getCurrentMember = async () => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${GET_CURRENT_MEMBER_ROUTE}`, 
    { ...DEFAULT_GET });
  return res.data;
};

export const getItemLogin = async (id: UUID) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetItemLoginRoute(id)}`, 
    { ...DEFAULT_GET });
  return res.data;
};
