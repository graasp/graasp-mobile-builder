import * as Api from '../api';
import { buildItemKey, OWN_ITEMS_KEY, SHARED_ITEMS_KEY } from '../config/keys';
import queryClient from '../config/queryClient';
import { Item } from '../types';

export const buildEditItem = (userToken: any) => ({
  mutationFn: async (newItem: any) => {
    return Api.editItem(newItem, userToken).then((data) => data);
  },
  onSuccess: (item: Item) => {
    queryClient.invalidateQueries({ queryKey: OWN_ITEMS_KEY });
    queryClient.invalidateQueries({ queryKey: SHARED_ITEMS_KEY });
    queryClient.setQueryData(buildItemKey(item.id), item);
  },
});
