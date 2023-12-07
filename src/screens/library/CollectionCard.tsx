import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';

import { DiscriminatedItem } from '@graasp/sdk';

import { useNavigation } from '@react-navigation/native';

import { LibraryScreenProp } from '../../navigation/types';
import CollectionCreator from './CollectionCreator';
import CollectionThumbnail from './CollectionThumbnail';
import Tags from './Tags';

type Props = {
  item: DiscriminatedItem;
};

const CollectionCard = ({ item }: Props) => {
  const { navigate } =
    useNavigation<LibraryScreenProp<'CollectionStack'>['navigation']>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigate('CollectionStack', { itemId: item.id });
      }}
    >
      {/* @ts-ignore */}
      <Card containerStyle={styles.container}>
        <CollectionThumbnail item={item} />
        <View style={styles.content}>
          <Card.Title h4 style={styles.title}>
            {item.name}
          </Card.Title>
          <CollectionCreator item={item} />
          <Tags item={item} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'lightgrey',
    padding: 0,
    overflow: 'hidden',
    borderRadius: 10,
  },
  content: {
    padding: 10,
  },
  title: {
    textAlign: 'left',
  },
  avatarAndCreator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
});

export default CollectionCard;
