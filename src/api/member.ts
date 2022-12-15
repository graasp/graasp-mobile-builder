import { axiosContentInstance } from '../config/axios';
import { API_HOST } from '../config/constants/constants';
import { UUID } from '../types';
import {
  buildGetMemberBy,
  buildGetMember,
  GET_CURRENT_MEMBER_ROUTE,
  buildEditMemberRoute,
} from './routes';
import { DEFAULT_GET, buildGetItemLoginRoute, DEFAULT_PATCH } from './utils';

export const getMemberBy = async ({ email }: { email: string }) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetMemberBy(email)}`,
    { ...DEFAULT_GET },
  );
  return res.data;
};

export const getMember = async ({ id, token }: { id: UUID; token: string }) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetMember(id)}`,
    { ...DEFAULT_GET(token) },
  );
  return res.data;
};

export const getCurrentMember = async ({ token }: { token: string }) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${GET_CURRENT_MEMBER_ROUTE}`,
    { ...DEFAULT_GET(token) },
  );
  return res.data;
};

export const getItemLogin = async (id: UUID) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetItemLoginRoute(id)}`,
    { ...DEFAULT_GET },
  );
  return res.data;
};

export const editMember = async (newMember: any, userToken: string) => {
  const res = await axiosContentInstance.patch(
    `${API_HOST}/${buildEditMemberRoute(newMember.id)}`,
    newMember,
    {
      ...DEFAULT_PATCH(userToken),
    },
  );
  return res.data;
};
