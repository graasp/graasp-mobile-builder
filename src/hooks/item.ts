import { useQuery } from 'react-query';
import { buildItemKey } from '../config/keys';
import queryClient from '../config/queryClient';
import {
  buildChildren,
  buildGetItem, buildItemLogin,
  buildOwnItems,
  buildParents,
  buildSharedItems,
} from './utils';
import { UUID } from '../types';
import { NullArgument } from '../utils/errors';
import { getUserToken } from '../utils/functions/token';
import { Item } from '../types';

export const useOwnItems = () => {
  const userToken: any = getUserToken();

  return useQuery({
    ...buildOwnItems(userToken),
    onSuccess: async (items: Item[]) => {
      // save items in their own key
      items?.forEach(async (item: Item) => {
        const { id } = item;
        queryClient.setQueryData(buildItemKey(id), item);
      });
    },
  });
};

export const useChildren = (itemId: UUID | null) => {
  const userToken: any = getUserToken();

  if (!itemId) {
    throw new NullArgument();
  }
  return useQuery({
    ...buildChildren(itemId, userToken),
    onSuccess: async (items: Item[]) => {
      if (items?.length) {
        // save items in their own key
        items.forEach(async (item: Item) => {
          const { id } = item;
          queryClient.setQueryData(buildItemKey(id), item);
        });
      }
    },
    enabled: Boolean(itemId),
  });
}

export const useParents = ({ id, path, enabled }: { id: UUID, path: string, enabled: boolean }) =>
  useQuery({
    ...buildParents({ id, path }),
    onSuccess: async (items: Item[]) => {
      if (items?.length) {
        // save items in their own key
        items.forEach(async (item) => {
          const { id: itemId } = item;
          queryClient.setQueryData(buildItemKey(itemId), (item));
        });
      }
    },
    enabled: enabled && Boolean(id),
  });

export const useSharedItems = () => {
  const userToken: any = getUserToken();

  return useQuery({
    ...buildSharedItems(userToken),
    onSuccess: async (items: Item[]) => {
      // save items in their own key
      items?.forEach(async (item: Item) => {
        const { id } = item;
        queryClient.setQueryData(buildItemKey(id), item);
      });
    },
  });
};

export const useItem = (id: UUID | null) => {
  const userToken: any = getUserToken();

  if (!id) {
    throw new NullArgument();
  }
  return useQuery({ ...buildGetItem(id, userToken), enabled: Boolean(id) });
};

export const useItemLogin = (id: UUID | null) => {
  if (!id) {
    throw new NullArgument();
  }
  return useQuery({ ...buildItemLogin(id), enabled: Boolean(id) });
};
