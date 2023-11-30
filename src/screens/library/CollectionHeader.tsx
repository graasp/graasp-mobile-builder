import { DiscriminatedItem } from '@graasp/sdk';

import Header from '../../components/common/Header';
import { useQueryClient } from '../../context/QueryClientContext';

type Props = {
  itemId: DiscriminatedItem['id'];
};

function CollectionHeader({ itemId }: Props) {
  const { hooks } = useQueryClient();
  const { data: item } = hooks.useItem(itemId);

  if (item) {
    return <Header title={item.name} />;
  }
  return null;
}

export default CollectionHeader;
