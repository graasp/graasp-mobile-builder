import { axiosContentInstance } from '../config/axios';
import { API_HOST } from '../config/constants/constants';
import { UUID } from '../types';
import { getParentsIdsFromPath } from '../utils/functions/item';
import {
  buildCreateItemRoute,
  buildEditItemRoute,
  buildGetChildrenRoute,
  buildGetItemFileUrlRoute,
  buildGetItemRoute,
  buildGetMemberAvatarRoute,
  GET_OWN_ITEMS_ROUTE,
  SHARE_ITEM_WITH_ROUTE,
} from './routes';
import {
  DEFAULT_DELETE,
  DEFAULT_GET,
  DEFAULT_PATCH,
  DEFAULT_POST,
} from './utils';

export const getItem = async (id: UUID, token?: string) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetItemRoute(id)}`,
    DEFAULT_GET(token),
  );
  return res.data;
};

export const getOwnItems = async (userToken: string) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${GET_OWN_ITEMS_ROUTE}`,
    DEFAULT_GET(userToken),
  );
  return res.data;
};

export const getChildren = async (id: UUID, token: string) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetChildrenRoute(id)}`,
    DEFAULT_GET(token),
  );
  return res.data;
};

export const getParents = async ({ path }: { path: string }) => {
  const parentIds = getParentsIdsFromPath(path, { ignoreSelf: true });
  if (parentIds.length) {
    return Promise.all(parentIds.map((id) => getItem(id)));
  }
  return [];
};

export const getSharedItems = async (token: string) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${SHARE_ITEM_WITH_ROUTE}`,
    DEFAULT_GET(token),
  );
  return res.data;
};

export const createItem = async (
  newItem: any,
  userToken: string,
  parentId?: UUID,
) => {
  const res = await axiosContentInstance.post(
    `${API_HOST}/${buildCreateItemRoute(parentId)}`,
    newItem,
    {
      ...DEFAULT_POST(userToken),
    },
  );
  return res.data;
};

export const editItem = async (newItem: any, userToken: string) => {
  const res = await axiosContentInstance.patch(
    `${API_HOST}/${buildEditItemRoute(newItem.id)}`,
    newItem,
    {
      ...DEFAULT_PATCH(userToken),
    },
  );
  return res.data;
};

export const deleteItem = async (itemId: UUID, userToken: string) => {
  const res = await axiosContentInstance.delete(
    `${API_HOST}/${buildEditItemRoute(itemId)}`,
    {
      ...DEFAULT_DELETE(userToken),
    },
  );
  return res.data;
};

export const getItemFileUrl = async (id: UUID, token?: string) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetItemFileUrlRoute(id)}`,
    DEFAULT_GET(token),
  );
  return res.data;
};

export const getMemberAvatarUrl = async (id: UUID, token?: string) => {
  const res = await axiosContentInstance.get(
    `${API_HOST}/${buildGetMemberAvatarRoute(id)}`,
    DEFAULT_GET(token),
  );
  return res.data;
};
