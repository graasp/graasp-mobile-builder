import { View, useWindowDimensions } from 'react-native';
import { Card } from 'react-native-elements';

import { DiscriminatedItem } from '@graasp/sdk';

import { useQueryClient } from '../../context/QueryClientContext';
import DefaultImage from './DefaultImage';

type Props = {
  item: DiscriminatedItem;
};

function CollectionThumbnail({ item }: Props) {
  const { hooks } = useQueryClient();
  const { width } = useWindowDimensions();
  const { data: thumbnail } = hooks.useItemThumbnailUrl({
    id: item.id,
    size: 'medium',
  });

  if (thumbnail) {
    return (
      <View style={{ alignItems: 'center', width: '100%' }}>
        <Card.Image
          source={{ uri: thumbnail }}
          //   todo: size
          style={{ width, height: 360 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <DefaultImage />
    </View>
  );
}

export default CollectionThumbnail;
