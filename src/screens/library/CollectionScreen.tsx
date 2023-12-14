import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Divider, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Context, formatDate } from '@graasp/sdk';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';

import ActivityIndicator from '../../components/ActivityIndicator';
import PlayerButton from '../../components/common/PlayerButton';
import { DEFAULT_LOCALE } from '../../config/constants/constants';
import { useQueryClient } from '../../context/QueryClientContext';
import { LibraryScreenProp } from '../../navigation/types';
import CollectionContent from './CollectionContent';
import CollectionCreator from './CollectionCreator';
import CollectionThumbnail from './CollectionThumbnail';
import Tags from './Tags';

const CollectionScreen = ({
  route: {
    params: { itemId },
  },
}: LibraryScreenProp<'CollectionStack'>) => {
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();
  const { hooks } = useQueryClient();
  const headerHeight = useHeaderHeight();
  const tabHeight = useBottomTabBarHeight();
  const { data: item, isLoading } = hooks.useItem(itemId);
  const { setOptions } = useNavigation();

  if (item) {
    setOptions({ title: item.name });

    return (
      <SafeAreaView edges={['left']}>
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View
            style={{
              minHeight: height - headerHeight - tabHeight,
              ...styles.container,
            }}
          >
            <CollectionThumbnail item={item} />
            <Text h3 style={styles.title}>
              {item.name}
            </Text>
            <View style={styles.titleAndicon}>
              <CollectionCreator item={item} />
              <View>
                <PlayerButton
                  size={28}
                  itemId={item.id}
                  origin={{ rootId: item.id, context: Context.Library }}
                  name={item.name}
                  type={item.type}
                />
              </View>
            </View>
            <Tags item={item} />
            {item.description && (
              <RenderHTML
                defaultTextProps={{ numberOfLines: 2 }}
                contentWidth={width}
                source={{ html: item.description }}
              />
            )}
            <CollectionContent item={item} />
            <Divider style={styles.divider} />
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{t('Creation Date')}:</Text>{' '}
              {formatDate(item.createdAt, {
                locale: i18n.language ?? DEFAULT_LOCALE,
              })}
            </Text>
            <Text>
              <Text style={{ fontWeight: 'bold' }}>{t('Last Update')}:</Text>{' '}
              {formatDate(item.updatedAt, {
                locale: i18n.language ?? DEFAULT_LOCALE,
              })}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return <Text>An error occured</Text>;
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    justifyItems: 'flex-start',
    flexDirection: 'column',
    padding: 20,
  },
  divider: {
    marginVertical: 15,
  },
  titleAndicon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    justifyItems: 'center',
  },
});

export default CollectionScreen;
