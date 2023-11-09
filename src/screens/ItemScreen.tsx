import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { Context, ItemType } from '@graasp/sdk';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import AppItem from '../components/AppItem';
import Document from '../components/Document';
import FileItem from '../components/FileItem';
import LinkItem from '../components/LinkItem';
import { useQueryClient } from '../context/QueryClientContext';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useFocusQuery } from '../utils/functions/useQuery';

type CommonStackItemProps = CompositeScreenProps<
  StackScreenProps<
    CommonStackParamList,
    'CommonStackItem',
    'CommonStackNavigator'
  >,
  StackScreenProps<RootStackParamList>
>;

export type ItemScreenNavigationProp = CommonStackItemProps['navigation'];

const ItemScreen: FC<CommonStackItemProps> = ({ route }) => {
  const { itemId } = route.params;
  const { hooks } = useQueryClient();
  const { data: item, isLoading, isError, refetch } = hooks.useItem(itemId);
  useFocusQuery(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !item) {
    return null;
  }

  const renderContent = () => {
    switch (item.type) {
      case ItemType.DOCUMENT: {
        const content = item.extra.document.content;
        return <Document content={content} />;
      }
      case ItemType.APP: {
        return <AppItem item={item} context={Context.Builder} />;
      }
      case ItemType.LINK: {
        return <LinkItem item={item} />;
      }
      case ItemType.S3_FILE: {
        return <FileItem item={item} />;
      }
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: '#4e4e4e',
  },
  value: {
    paddingBottom: 20,
  },
});

export default ItemScreen;
