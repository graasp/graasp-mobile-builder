import * as Api from '../api';
import {
  STALE_TIME_MILLISECONDS,
  CACHE_TIME_MILLISECONDS,
} from '../config/constants/constants';
import {
  buildItemChildrenKey,
  buildItemKey,
  buildItemLoginKey,
  buildItemParentsKey,
  buildMemberIdKey,
  OWN_ITEMS_KEY,
  SHARED_ITEMS_KEY,
} from '../config/keys';
import { Item, UUID } from '../types';

const itemQueryConfig = {
  staleTime: STALE_TIME_MILLISECONDS, // time until data in cache considered stale if cache not invalidated
  cacheTime: CACHE_TIME_MILLISECONDS, // time before cache labeled as inactive to be garbage collected
  retry: false,
};

export const buildGetItem = (id: UUID, userToken: string) => ({
  queryKey: buildItemKey(id),
  queryFn: (): Promise<Item> => Api.getItem(id, userToken).then((data) => data),
  ...itemQueryConfig,
});

export const buildOwnItems = (userToken: string) => ({
  queryKey: OWN_ITEMS_KEY,
  queryFn: (): Promise<Item[]> =>
    Api.getOwnItems(userToken).then((data) => {
      return data;
    }),
  ...itemQueryConfig,
});

export const buildChildren = (id: UUID, token: string) => ({
  queryKey: buildItemChildrenKey(id),
  queryFn: (): Promise<Item[]> =>
    Api.getChildren(id, token).then((data: Item[]) => data),
  ...itemQueryConfig,
});
export const buildParents = ({ id, path }: { id: UUID; path: string }) => ({
  queryKey: buildItemParentsKey(id),
  queryFn: (): Promise<Item[]> => Api.getParents({ path }).then((data) => data),
  ...itemQueryConfig,
});

export const buildSharedItems = (userToken: string) => ({
  queryKey: SHARED_ITEMS_KEY,
  queryFn: (): Promise<Item[]> =>
    Api.getSharedItems(userToken).then((data) => data),
  ...itemQueryConfig,
});

export const buildMemberKey = (id: UUID, token: string, enabled: boolean) => ({
  queryKey: buildMemberIdKey(id),
  queryFn: () => Api.getMember({ id, token }).then((data) => data),
  enabled: enabled && Boolean(id),
  ...itemQueryConfig,
});

export const buildItemLogin = (id: UUID) => ({
  queryKey: buildItemLoginKey(id),
  queryFn: () => Api.getItemLogin(id).then((data) => data),
  enabled: Boolean(id),
  ...itemQueryConfig,
});
