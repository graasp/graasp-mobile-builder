import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ItemType,
  formatDate,
  getFileExtra,
  getS3FileExtra,
} from '@graasp/sdk';

import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import ItemIcon from '../components/ItemIcon';
import { DEFAULT_LOCALE, TEXT_ALIGNMENT } from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { CommonStackParamList } from '../navigation/CommonStackNavigator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { humanFileSize } from '../utils/functions/fileSize';
import { useFocusQuery } from '../utils/functions/useQuery';

type CommonStackDetailProps = CompositeScreenProps<
  StackScreenProps<
    CommonStackParamList,
    'CommonStackDetail',
    'CommonStackNavigator'
  >,
  StackScreenProps<RootStackParamList>
>;

const classesStyles = {
  'ql-align-right': { textAlign: TEXT_ALIGNMENT.RIGHT },
  'ql-align-center': { textAlign: TEXT_ALIGNMENT.CENTER },
  'ql-align-left': { textAlign: TEXT_ALIGNMENT.LEFT },
  'ql-align-justify': { textAlign: TEXT_ALIGNMENT.JUSTIFY },
};

const DetailsScreen: FC<CommonStackDetailProps> = ({ route }) => {
  const { itemId } = route.params;
  const { t } = useTranslation();
  const { hooks } = useQueryClient();
  const {
    data: item,
    isLoading: isLoadingItem,
    isError: isErrorItem,
    refetch: refetchItem,
  } = hooks.useItem(itemId);
  useFocusQuery(refetchItem);

  const {
    data: creatorData,
    isLoading: isLoadingName,
    refetch: refetchMember,
    isError: isErrorMember,
  } = hooks.useMember(item?.creator?.id);
  useFocusQuery(refetchMember);

  if (isLoadingItem || !item?.name) {
    return <ActivityIndicator />;
  }

  if (isErrorItem || !item || isErrorMember) {
    return null;
  }
  const { createdAt, extra, name, type, updatedAt, description } = item;
  if (isLoadingName || !creatorData?.name) {
    return <ActivityIndicator />;
  }
  let typeContent = null;
  let sizeContent = null;

  if (type === ItemType.S3_FILE) {
    const extraContent = getS3FileExtra(extra);
    ({ mimetype: typeContent, size: sizeContent } = extraContent);
  } else if (type === ItemType.LOCAL_FILE) {
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
        <ItemIcon type={type} extra={extra} size={100} style={styles.icon} />
        <Text h4 style={styles.value}>
          {name}
        </Text>
        {description ? (
          <RenderHtml
            classesStyles={classesStyles}
            source={{ html: description }}
          />
        ) : null}
        <Text style={styles.header}>{t('Type')}</Text>
        <Text style={styles.value}>{typeContent}</Text>
        {sizeContent != null && (
          <>
            <Text style={styles.header}>{t('Size')}</Text>
            <Text style={styles.value}>{humanFileSize(sizeContent, true)}</Text>
          </>
        )}
        {creatorData.name && (
          <>
            <Text style={styles.header}>{t('Creator')}</Text>
            <Text style={styles.value}>{creatorData.name}</Text>
          </>
        )}
        <Text style={styles.header}>{t('Creation Date')}</Text>
        <Text style={styles.value}>
          {formatDate(createdAt, { locale: DEFAULT_LOCALE })}
        </Text>
        <Text style={styles.header}>{t('Last update')}</Text>
        <Text style={styles.value}>
          {formatDate(updatedAt, { locale: DEFAULT_LOCALE })}
        </Text>
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
