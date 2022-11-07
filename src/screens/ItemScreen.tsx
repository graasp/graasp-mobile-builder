import React, { FC } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { useItem } from '../hooks';
import { useFocusQuery } from '../utils/functions/useQuery';
import ActivityIndicator from '../components/ActivityIndicator';
import { ITEM_TYPES } from '../config/constants/constants';
import Document from '../components/Document';
import WebView from 'react-native-webview';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';

type CommonStackItemProps = CompositeScreenProps<
  StackScreenProps<CommonStackParamList, 'CommonStackItem', 'CommonStackNavigator'>,
  StackScreenProps<RootStackParamList>
>;
type ItemScreenRouteProp = CommonStackItemProps['route'];

const ItemScreen: FC<CommonStackItemProps> = () => {
  const dimensions = useWindowDimensions();
  let route = useRoute<ItemScreenRouteProp>();
  let { itemId } = route.params;
  const { data: item, isLoading, isError, refetch } = useItem(itemId);
  useFocusQuery(refetch);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isError || !item) {
    throw new Error();
  }

  const renderContent = () => {
    const { name, type, extra, id } = item;

    switch (type) {
      case ITEM_TYPES.DOCUMENT:
        const content = extra.document?.content;
        return <Document content={content} />;
      case ITEM_TYPES.APP:
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
            style={{ width: dimensions.width - insets.left, height: 400, marginLeft: insets.left, marginBottom: insets.bottom }}
          />
        );
      case ITEM_TYPES.LINK:
        const uri = extra.embeddedLink?.url;
        return (
          <WebView
            source={{ uri }}
            scalesPageToFit={false}
            startInLoadingState={true}
            overScrollMode="never"
            style={{ width: dimensions.width - insets.left, height: 400, marginLeft: insets.left }}
          />
        );
      case ITEM_TYPES.S3_FILE:
        return (
          <>
            <Text style={styles.value}>
              {name}
            </Text>
            <Text style={styles.header}>Type</Text>
            <Text style={styles.value}>S3 File</Text>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>{renderContent()}</View>
  );
}

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
