import * as Api from '../api';
import { buildItemKey } from '../config/keys';
import queryClient from '../config/queryClient';
import { Item, Member, UUID } from '../types';

export const buildCreateItem = (
  userToken: any,
  refresh: () => void,
  parentId?: UUID,
) => ({
  mutationFn: async (newItem: Partial<Item>) => {
    return Api.createItem(newItem, userToken, parentId).then((data) => data);
  },
  onSuccess: (item: Item) => {
    refresh();
    queryClient.setQueryData(buildItemKey(item.id), item);
  },
});

export const buildEditItem = (userToken: any, refresh: () => void) => ({
  mutationFn: async (newItem: Partial<Item>) => {
    return Api.editItem(newItem, userToken).then((data) => data);
  },
  onSuccess: (item: Item) => {
    refresh();
    queryClient.setQueryData(buildItemKey(item.id), item);
  },
});

export const buildDeleteItem = (userToken: any, refresh: () => void) => ({
  mutationFn: async (itemId: UUID) => {
    return Api.deleteItem(itemId, userToken).then((data) => data);
  },
  onSuccess: (item: Item) => {
    refresh();
    queryClient.setQueryData(buildItemKey(item.id), item);
  },
});

export const buildEditMember = (userToken: any, refresh: () => void) => ({
  mutationFn: async (newMember: Partial<Member>) => {
    return Api.editMember(newMember, userToken).then((data) => data);
  },
  onSuccess: () => {
    refresh();
  },
});
