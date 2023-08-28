import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemIcon from '../components/ItemIcon';
import { ITEM_TYPES } from '../config/constants/constants';
import { useItem } from '../hooks';
import { useMember } from '../hooks/member';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { formatDate } from '../utils/functions/date';
import { humanFileSize } from '../utils/functions/fileSize';
import { getFileExtra, getS3FileExtra } from '../utils/functions/itemExtra';
import { useFocusQuery } from '../utils/functions/useQuery';

type CommonStackDetailProps = CompositeScreenProps<
  StackScreenProps<
    CommonStackParamList,
    'CommonStackDetail',
    'CommonStackNavigator'
  >,
  StackScreenProps<RootStackParamList>
>;

const DetailsScreen: FC<CommonStackDetailProps> = ({ route }) => {
  const { itemId } = route.params;
  const { t } = useTranslation();

  const {
    data: item,
    isLoading: isLoadingItem,
    isError: isErrorItem,
    refetch: refetchItem,
  } = useItem(itemId);
  useFocusQuery(refetchItem);

  if (isLoadingItem || !item?.name) {
    return <ActivityIndicator />;
  }

  if (isErrorItem || !item) {
    return null;
  }

  const {
    data: creatorData,
    isLoading: isLoadingName,
    refetch: refetchMember,
  } = useMember(item.creator.id, { enabled: Boolean(item) });
  useFocusQuery(refetchMember);

  const { createdAt, creator, description, extra, id, name, type, updatedAt } =
    item;
  if (isLoadingName || !creatorData?.name) {
    return <ActivityIndicator />;
  }
  let typeContent = null;
  let sizeContent = null;

  if (type === ITEM_TYPES.S3_FILE) {
    const extraContent = getS3FileExtra(extra);
    ({ mimetype: typeContent, size: sizeContent } = extraContent);
  } else if (type === ITEM_TYPES.FILE) {
    const extraContent = getFileExtra(extra);
    ({ mimetype: typeContent, size: sizeContent } = extraContent);
  } else {
    typeContent = type;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          paddingHorizontal: 20,
        }}
      >
        <ItemIcon
          type={type}
          extra={extra}
          name={name}
          size={100}
          style={styles.icon}
        />
        <Text h4 style={styles.value}>
          {name}
        </Text>
        <Text style={styles.header}>{t('Type')}</Text>
        <Text style={styles.value}>{typeContent}</Text>
        {sizeContent != null && (
          <>
            <Text style={styles.header}>{t('Size')}</Text>
            <Text style={styles.value}>{humanFileSize(sizeContent, true)}</Text>
          </>
        )}
        <Text style={styles.header}>{t('Creator')}</Text>
        <Text style={styles.value}>{creatorData.name}</Text>
        <Text style={styles.header}>{t('Creation')}</Text>
        <Text style={styles.value}>{formatDate(createdAt)}</Text>
        <Text style={styles.header}>{t('Last update')}</Text>
        <Text style={styles.value}>{formatDate(updatedAt)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  icon: {
    alignSelf: 'center',
  },
  header: {
    color: '#4e4e4e',
  },
  value: {
    paddingBottom: 20,
  },
});

export default DetailsScreen;
