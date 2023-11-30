import { StyleSheet, View } from 'react-native';
import { Chip } from 'react-native-elements';

import { DiscriminatedItem, IndexItem } from '@graasp/sdk';

import { PRIMARY_COLOR } from '../../config/constants/constants';
import { useCategoriesTranslation } from '../../config/i18n';
import { useQueryClient } from '../../context/QueryClientContext';

type Props = {
  item: DiscriminatedItem | IndexItem;
};

function Tags({ item }: Props) {
  const { hooks } = useQueryClient();
  const { t: translateCategories } = useCategoriesTranslation();
  const { data: itemCategories } = hooks.useItemCategories(item.id);

  const sortedItemCategories = itemCategories?.map((c) => ({
    ...c,
    category: { name: translateCategories(c.category.name) },
  }));
  sortedItemCategories?.sort((c1, c2) =>
    c1.category.name.localeCompare(c2.category.name),
  );

  const categories = sortedItemCategories?.map(({ category: { name }, id }) => (
    <Chip
      key={id}
      // need both styles to apply correctly
      titleStyle={styles.chip}
      buttonStyle={styles.chip}
      // todo: translate categories
      title={name}
      type="outline"
    />
  ));

  let tags: JSX.Element[] = [];
  const settings = (item as DiscriminatedItem).settings;
  if (settings?.tags) {
    tags = settings.tags?.map((t: string) => (
      <Chip
        // need both styles to apply correctly
        titleStyle={styles.chip}
        buttonStyle={styles.chip}
        title={t}
        type="outline"
      />
    ));
  }

  if (categories?.length || tags?.length) {
    return (
      <View style={styles.container}>
        {categories}
        {tags}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginVertical: 10,
  },
  chip: {
    color: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
});

export default Tags;
