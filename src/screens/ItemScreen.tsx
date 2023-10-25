import { FC } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import { ItemType } from '@graasp/sdk';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import Document from '../components/Document';
import FileItem from '../components/FileItem';
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
  const dimensions = useWindowDimensions();
  const { itemId } = route.params;
  const { hooks } = useQueryClient();
  const { data: item, isLoading, isError, refetch } = hooks.useItem(itemId);
  useFocusQuery(refetch);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !item) {
    return null;
  }

  const renderContent = () => {
    const { type, extra } = item;

    switch (type) {
      case ItemType.DOCUMENT: {
        const content = extra.document?.content;
        return <Document content={content} />;
      }
      case ItemType.APP: {
        const url = extra.app?.url;
        console.log('The url :    ', url);
        return (
          <WebView
            source={{ uri: url }}
            scalesPageToFit={false}
            startInLoadingState={true}
            overScrollMode="never"
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
            cacheEnabled={true}
            style={{
              width: dimensions.width - insets.left,
              height: '100%',
              marginLeft: insets.left,
              marginBottom: insets.bottom,
            }}
          />
        );
      }
      case ItemType.LINK: {
        const uri = extra.embeddedLink?.url;
        return (
          <WebView
            source={{ uri }}
            scalesPageToFit={false}
            startInLoadingState={true}
            overScrollMode="never"
            cacheEnabled={true}
            style={{
              width: dimensions.width - insets.left,
              height: '100%',
              marginLeft: insets.left,
            }}
          />
        );
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
