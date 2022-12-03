import { UUID } from '../types';
import { ITEMS_ROUTE } from './routes';

export const DEFAULT_GET = (token?: string) => ({
  withCredentials: true,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

export const DEFAULT_POST = {
  method: 'POST',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
};

export const DEFAULT_DELETE = {
  method: 'DELETE',
  withCredentials: true,
};

export const DEFAULT_PATCH = (token: string) => ({
  withCredentials: true,
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});

export const DEFAULT_PUT = {
  method: 'PUT',
  withCredentials: true,
};

export const failOnError = (res: any) => {
  if (!res.ok) {
    //throw new Error(res.statusText);
    console.log('error: ', res);
  }

  // res.status >= 200 && res.status < 300
  return res;
};

export const buildGetItemLoginRoute = (id: UUID) =>
  `${ITEMS_ROUTE}/${id}/login-schema`;
